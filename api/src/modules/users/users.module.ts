import { Module } from '@nestjs/common';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MailModule } from '../mail/mail.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    MailModule, // Modulo de Mail
    BullModule.registerQueue({ name: 'mail' }), // Modulo Bull/Colas]
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
