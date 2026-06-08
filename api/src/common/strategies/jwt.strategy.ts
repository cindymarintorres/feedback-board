import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../modules/users/users.service';
import { JwtPayload, JwtUser, JwtUserSchema } from 'feedbackboard-shared';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');

    if (!jwtSecret) {
      throw new Error('JWT_SECRET no se encuentra en la configuración');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
      algorithms: ['HS256'],
    });
  }

  async validate(payload: JwtPayload): Promise<JwtUser> {
    const user = await this.usersService.findById(payload.id);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Usuario inactivo o no autorizado');
    }

    // Zod valida en runtime que lo que devuelves es correcto
    return JwtUserSchema.parse({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  }
}
