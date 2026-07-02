import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { MailService } from './mail.service';
import type {
  ForgotPasswordDto,
  ResetPasswordDto,
  RegisterDto,
} from 'feedbackboard-shared';

@Processor('mail')
export class MailProcessor {
  private readonly logger = new Logger(MailProcessor.name);

  constructor(private readonly mailService: MailService) {}

  @Process('password-reset')
  async handlePasswordReset(
    job: Job<ForgotPasswordDto & ResetPasswordDto>,
  ): Promise<void> {
    const { email, token } = job.data;
    this.logger.log(`Enviando email de reset a ${email}`);

    await this.mailService.sendPasswordReset(email, token);

    this.logger.log(`Email de reset enviado a ${email}`);
  }

  @Process('welcome')
  async handleWelcome(job: Job<RegisterDto>): Promise<void> {
    const { email, name } = job.data;
    this.logger.log(`Enviando email de bienvenida a ${email}`);

    await this.mailService.sendWelcome(email, name);

    this.logger.log(`Email de bienvenida enviado a ${email}`);
  }

  @Process('suggestion-created')
  async handleSuggestionCreated(
    job: Job<{ email: string; name: string; title: string }>,
  ): Promise<void> {
    const { email, name, title } = job.data;
    this.logger.log(`Enviando email de sugerencia a ${email}`);
    await this.mailService.sendSuggestionCreated(email, name, title);
    this.logger.log(`Email de sugerencia enviado a ${email}`);
  }

  @Process('vote-created')
  async handleVoteCreated(
    job: Job<{ email: string; name: string; type: string }>,
  ): Promise<void> {
    const { email, name, type } = job.data;
    this.logger.log(`Enviando email de voto a ${email}`);
    await this.mailService.sendVoteCreated(email, name, type);
    this.logger.log(`Email de voto enviado a ${email}`);
  }
}
