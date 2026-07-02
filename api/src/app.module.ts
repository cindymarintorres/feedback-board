import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import * as path from 'path';
import { validate } from './config/env';

import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './modules/mail/mail.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CommercesModule } from './modules/commerces/commerces.module';
import { SuggestionsModule } from './modules/suggestions/suggestions.module';
import { VotesModule } from './modules/votes/votes.module';

@Module({
  imports: [
    ConfigModule.forRoot({ //Motor de configuraciones
      isGlobal: true,
      envFilePath: [
        path.resolve(__dirname, '../../../.env'), // local dev
        '.env', // fallback Docker
      ],
      validate,
    }),
    ThrottlerModule.forRoot([ //Motor de validacion de peticiones
      {
        ttl: 60000, // 1 minuto en ms
        limit: 100, // 100 requests por ventana
      },
    ]),
    BullModule.forRoot({ //Motor de colas
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    }),
    ScheduleModule.forRoot(), //Motor de cronjobs
    PrismaModule,
    UsersModule,
    AuthModule,
    MailModule,
    CommercesModule,
    SuggestionsModule,
    VotesModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard, //aplica a TODOS los endpoints automáticamente
    },
  ],
})
export class AppModule {}
