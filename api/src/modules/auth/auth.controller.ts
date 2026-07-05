import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  UsePipes,
  Query,
  Res,
  Req,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import {
  BaseRegisterSchema,
  BaseLoginSchema,
  BaseForgotPasswordSchema,
  BaseResetPasswordSchema,
  BaseRegisterCommerceSchema
} from 'feedbackboard-shared';
import type {
  RegisterDto,
  LoginDto,
  ResetPasswordDto,
  ForgotPasswordDto,
} from './schemas/auth.schema';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { getRefreshCookieOptions } from '../../common/helpers/cookie-options.helper';
import { Request, Response } from 'express';
import { MissingRefreshTokenException } from './errors/auth.errors';
import { RegisterCommerceDto } from '../commerces/schemas/commerce.schema';

type RequestWithUser = { user: { id: string } };

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(BaseLoginSchema))
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(body); // Si falla, InvalidCredentialsException sube sola

    response.cookie('refresh_token', result.refreshToken, getRefreshCookieOptions());

    return { accessToken: result.accessToken, user: result.user };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refresh_token', getRefreshCookieOptions());
    return { message: 'Sesión cerrada' };
  }

  @Post('register')
  register(@Body(new ZodValidationPipe(BaseRegisterSchema)) body: RegisterDto) {
    return this.authService.register(body); // Errores de DB suben como 500
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: RequestWithUser) {
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

  @Post('refresh')
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies?.['refresh_token'] as string | undefined;

    if (!refreshToken) throw new MissingRefreshTokenException();

    const result = await this.authService.refresh(refreshToken);

    // renueva la cookie con cada refresh (rotation)
    response.cookie('refresh_token', result.refreshToken, getRefreshCookieOptions());

    return { accessToken: result.accessToken, user: result.user };
  }

  @Post('register-commerce')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(BaseRegisterCommerceSchema))
  async registerCommerce(
    @Body() body: RegisterCommerceDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.registerCommerce(body);
    response.cookie('refresh_token', result.refreshToken, getRefreshCookieOptions());
    return { accessToken: result.accessToken, user: result.user };
  }

  @Get('verify-commerce')
  @HttpCode(HttpStatus.OK)
  async verifyCommerce(@Query('token') token: string) {
    return this.authService.verifyCommerce(token);
  }
}
