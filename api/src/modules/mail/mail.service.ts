import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { ROUTES } from '../../config/routes';

@Injectable()
export class MailService {
  constructor(
    private readonly mailer: MailerService,
    private readonly config: ConfigService,
  ) {}

  private readonly logger = new Logger(MailService.name)

  async sendPasswordReset(email: string, token: string): Promise<void> {
    const webUrl = this.config.getOrThrow<string>('WEB_URL');
    const resetUrl = `${webUrl}${ROUTES.auth.resetPassword}?token=${token}`;

    try {
      await this.mailer.sendMail({
        to: email,
        subject: 'Restablecer contraseña — FeedbackBoard',
        template: 'password-reset',
        context: { resetUrl },
      });

      this.logger.log(`✅ Password reset email enviado a ${email}`);

    } catch (error) {

      this.logger.error('❌ Error enviando password reset email', error);
      throw error;
    }
  }

  async sendWelcome(email: string, name: string): Promise<void> {
    const webUrl = this.config.getOrThrow<string>('WEB_URL');
    const loginUrl = `${webUrl}${ROUTES.auth.login}`;

    try {
      await this.mailer.sendMail({
        to: email,
        subject: '¡Bienvenido a FeedbackBoard!',
        template: 'welcome',
        context: { name, loginUrl },
      });
      this.logger.log(`✅ Welcome email enviado a ${email}`);
    } catch (error) {
      this.logger.error('❌ Error enviando welcome email', error);
      throw error;
    }
  }
}
