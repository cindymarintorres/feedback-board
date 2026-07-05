import { Module } from '@nestjs/common'
import { SuggestionsController } from './suggestions.controller'
import { SuggestionsService } from './suggestions.service'
import { MailModule } from '../mail/mail.module'
import { BullModule } from '@nestjs/bull'

@Module({
  imports: [
    MailModule,                                    // Modulo de Mail
    BullModule.registerQueue({ name: 'mail' })],    // Modulo Bull/Colas],
  controllers: [SuggestionsController],
  providers: [SuggestionsService],
  exports: [SuggestionsService],
})
export class SuggestionsModule {}