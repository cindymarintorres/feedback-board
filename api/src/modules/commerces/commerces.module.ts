import { Module } from '@nestjs/common'

import { CommercesController } from './commerces.controller'
import { CommercesService } from './commerces.service'
import { MailModule } from '../mail/mail.module'
import { BullModule } from '@nestjs/bull'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [
    MailModule,                                    // Modulo de Mail
    BullModule.registerQueue({ name: 'mail' }), // Modulo Bull/Colas]
    UsersModule
  ],
  controllers: [CommercesController],
  providers: [CommercesService],
  exports: [CommercesService],
})
export class CommercesModule {}