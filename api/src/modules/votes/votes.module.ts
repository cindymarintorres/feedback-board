import { Module } from '@nestjs/common'
import { VotesController } from './votes.controller'
import { VotesService } from './votes.service'
import { MailModule } from '../mail/mail.module'
import { BullModule } from '@nestjs/bull'
import { VotesQueryController } from './votes-query.controller'

@Module({
  imports: [
    MailModule,                                    // Modulo de Mail
    BullModule.registerQueue({ name: 'mail' })],    // Modulo Bull/Colas],
  controllers: [VotesController, VotesQueryController],
  providers: [VotesService],
})
export class VotesModule {}