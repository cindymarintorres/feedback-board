import { Injectable } from '@nestjs/common'; // ← ya no importas BadRequest/Unauthorized
import {
  InvalidCredentialsException,
  InvalidTokenException,
  ExpiredTokenException,
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
} from './schemas/auth.schema';
import type {
  PublicUser,
  LoginResponse,
  JwtPayload,
} from 'feedbackboard-shared';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
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

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const authUser = await this.validateUser(loginDto.email, loginDto.password);
    const payload: JwtPayload = {
      id: authUser.id,
      email: authUser.email,
      role: authUser.role,
    };
    return {
      accessToken: this.jwtService.sign(payload),
      user: authUser,
    };
  }

  async register(data: RegisterDto) {
    // 1. Crear el usuario en DB
    const user = await this.usersService.create(data);

    // await this.mailService.sendWelcome(user.email, user.name)
    // 2. Agregar job a la cola (NO esperas que el correo se envíe)
    //'welcome' → el nombre del job (como un tipo/evento)
    //{ to, name } → los datos del job (el payload)
    await this.mailQueue.add('welcome', { email: user.email, name: user.name });

    // 3. Respondes 201 INMEDIATAMENTE
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

    if (!resetRecord) throw new InvalidTokenException();
    if (resetRecord.expiresAt < new Date()) throw new ExpiredTokenException();

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    await this.prisma.user.update({
      where: { id: resetRecord.userId },
      data: { password: hashedPassword },
    });

    await this.prisma.passwordResetToken.delete({
      where: { token: dto.token },
    });
    // await this.mailService.sendPasswordChanged(user.email)
    return { message: 'Contraseña actualizada correctamente' };
  }

  async validateToken(token: string) {
    const record = await this.prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!record || record.expiresAt < new Date()) {
      if (!record || record.expiresAt < new Date())
        throw new InvalidTokenException();
    }

    return { valid: true };
  }

  async getProfile(userId: string) {
    return this.usersService.findById(userId);
  }
}
