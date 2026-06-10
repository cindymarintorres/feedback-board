import { Injectable, Logger } from '@nestjs/common'; // ← ya no importas BadRequest/Unauthorized
import {
  InvalidCredentialsException,
  InvalidTokenException,
} from './errors/auth.errors';

import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import type {
  RegisterDto,
  LoginDto,
  ResetPasswordDto,
  ForgotPasswordDto,
  AuthResult,
} from './schemas/auth.schema';
import type { PublicUser, JwtPayload } from 'feedbackboard-shared';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    @InjectQueue('mail') private readonly mailQueue: Queue, // Cola
  ) {}

  async validateUser(
    userEmail: string,
    userPassword: string,
  ): Promise<PublicUser> {
    const user = await this.usersService.findByEmail(userEmail);

    if (!user || !user.isActive) throw new InvalidCredentialsException();

    const isPasswordValid = await bcrypt.compare(userPassword, user.password);

    if (!isPasswordValid) throw new InvalidCredentialsException();

    const { password, isActive, ...publicUser } = user;

    return publicUser;
  }

  async login(loginDto: LoginDto): Promise<AuthResult> {
    const authUser = await this.validateUser(loginDto.email, loginDto.password);
    const payload: JwtPayload = {
      id: authUser.id,
      email: authUser.email,
      role: authUser.role,
    };

    const accessToken = this.jwtService.sign(payload);

    //genera el refresh token con su propio secret y expiración larga
    const refreshOptions = {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET') ?? '',
      expiresIn: (this.configService.get<string>('REFRESH_TOKEN_EXPIRE_IN') ??
        '7d') as any,
    };

    const refreshToken = this.jwtService.sign(payload, refreshOptions);

    return { accessToken, refreshToken, user: authUser };
  }

  async register(data: RegisterDto) {
    // 1. Crear el usuario en DB
    const user = await this.usersService.create(data);

    // 2. Agregar job a la cola (NO esperas que el correo se envíe)
    //'welcome' → el nombre del job (como un tipo/evento)
    //{ to, name } → los datos del job (el payload)
    await this.mailQueue.add('welcome', { email: user.email, name: user.name });

    // 3. Responde 201 INMEDIATAMENTE
    //return { message: 'Usuario creado' };
    return user;
  }

  // ─── Generate Reset Token for email───────────────────────────────
  private generateResetToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(dto.email);

    // Siempre responde igual — no revela si el email existe
    if (!user || !user.isActive)
      return { message: 'Si el correo existe, recibirás un email' };
    const token = this.generateResetToken();
    await this.prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    });
    // await this.mailService.sendPasswordReset(user.email, token)

    await this.mailQueue.add('password-reset', { email: user.email, token });
    return { message: 'Si el correo existe, recibirás un email' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const resetRecord = await this.prisma.passwordResetToken.findUnique({
      where: { token: dto.token },
    });

    if (!resetRecord) {
      this.logger.warn(`resetPassword: token no encontrado`);
      throw new InvalidTokenException();
    }

    if (resetRecord.expiresAt < new Date()) {
      this.logger.warn(
        `resetPassword: token expirado - userId: ${resetRecord.userId}`,
      );
      throw new InvalidTokenException();
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: resetRecord.userId },
        data: { password: hashedPassword },
      }),
      this.prisma.passwordResetToken.delete({
        where: { token: dto.token },
      }),
    ]);

    return { message: 'Contraseña actualizada correctamente' };
  }

  async validateToken(token: string) {
    const record = await this.prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!record) {
      this.logger.warn(`validateToken: token no encontrado`);
      throw new InvalidTokenException();
    }

    if (record.expiresAt < new Date()) {
      this.logger.warn(
        `validateToken: token expirado - userId: ${record.userId}`,
      );
      throw new InvalidTokenException();
    }

    return { valid: true };
  }

  async getProfile(userId: string) {
    return this.usersService.findById(userId);
  }

  async refresh(refreshToken: string): Promise<AuthResult> {
    try {
      const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      });

      const user = await this.usersService.findById(payload.id);
      if (!user || !user.isActive) throw new InvalidCredentialsException();

      const { isActive, ...publicUser } = user;

      const newPayload: JwtPayload = {
        id: publicUser.id,
        email: publicUser.email,
        role: publicUser.role,
      };

      const refreshOptions = {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET') ?? '',
        expiresIn: (this.configService.get<string>('REFRESH_TOKEN_EXPIRE_IN') ??
          '7d') as any,
      };

      return {
        accessToken: this.jwtService.sign(newPayload),
        refreshToken: this.jwtService.sign(newPayload, refreshOptions),
        user: publicUser,
      };
    } catch {
      throw new InvalidTokenException();
    }
  }
}
