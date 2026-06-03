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
}
