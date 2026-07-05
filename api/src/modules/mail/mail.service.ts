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

  private readonly logger = new Logger(MailService.name);

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

  async sendSuggestionCreated(
    email: string,
    name: string,
    title: string,
  ): Promise<void> {
    try {
      await this.mailer.sendMail({
        to: email,
        subject: 'Tu sugerencia fue enviada — FeedbackBoard',
        template: 'suggestion-created',
        context: { name, title },
      });
      this.logger.log(`✅ Suggestion email enviado a ${email}`);
    } catch (error) {
      this.logger.error('❌ Error enviando suggestion email', error);
      throw error;
    }
  }

  async sendVoteCreated(
    email: string,
    name: string,
    type: string,
  ): Promise<void> {
    try {
      await this.mailer.sendMail({
        to: email,
        subject: 'Tu voto fue registrado — FeedbackBoard',
        template: 'vote-created',
        context: { name, type },
      });
      this.logger.log(`✅ Vote email enviado a ${email}`);
    } catch (error) {
      this.logger.error('❌ Error enviando vote email', error);
      throw error;
    }
  }

  async sendCommerceVerification(
    email: string,
    name: string,
    commerceName: string,
    token: string,
  ): Promise<void> {
    const webUrl = this.config.getOrThrow<string>('WEB_URL');
    const verifyUrl = `${webUrl}${ROUTES.commerces.verifyCommerce}?token=${token}`;

    try {
      await this.mailer.sendMail({
        to: email,
        subject: 'Verifica tu comercio — FeedbackBoard',
        template: 'commerce-verify',
        context: { name, commerceName, verifyUrl },
      });
      this.logger.log(`✅ Commerce verification email enviado a ${email}`);
    } catch (error) {
      this.logger.error('❌ Error enviando commerce verification email', error);
      throw error;
    }
  }
}
