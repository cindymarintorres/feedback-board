import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  UsePipes,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import {
  BaseRegisterSchema,
  BaseLoginSchema,
  BaseForgotPasswordSchema,
  BaseResetPasswordSchema,
} from 'feedbackboard-shared';
import type {
  RegisterDto,
  LoginDto,
  ResetPasswordDto,
  ForgotPasswordDto,
} from './schemas/auth.schema';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

type RequestWithUser = { user: { id: string } };

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(BaseLoginSchema))
  async login(@Body() body: LoginDto) {
    return this.authService.login(body); // Si falla, InvalidCredentialsException sube sola
  }

  /* @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  logout() {
    // Para JWT, el logout suele manejarse en el cliente descartando el token.
    // Si se requiere invalidación en el servidor, se puede usar Redis para blacklisting.
    return { message: 'Cerrado sesión correctamente' };
  }
*/

  @Post('register')
  register(@Body(new ZodValidationPipe(BaseRegisterSchema)) body: RegisterDto) {
    return this.authService.register(body); // Errores de DB suben como 500
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req: RequestWithUser) {
    return this.authService.getProfile(req.user.id);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(BaseForgotPasswordSchema))
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    await this.authService.forgotPassword(body);
    return { message: 'Si el correo existe, recibirás un email' };
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(BaseResetPasswordSchema))
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authService.resetPassword(resetPasswordDto);
    return { message: 'Contraseña actualizada correctamente' };
  }

  @Get('validate-token')
  @HttpCode(HttpStatus.OK)
  async validateToken(@Query('token') token: string) {
    return this.authService.validateToken(token); // { valid: true } viene del servicio
  }
}
