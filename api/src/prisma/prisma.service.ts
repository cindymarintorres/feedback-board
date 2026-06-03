import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  // Inyectamos ConfigService correctamente en el constructor
  constructor(private configService: ConfigService) {
    
    // Obtenemos la URL del .env
    const url = configService.get<string>('DATABASE_URL');
    
    // Creamos el Pool de conexiones de Postgres
    const pool = new Pool({ connectionString: url });
    
    // Creamos el adaptador pasándole el Pool
    const adapter = new PrismaPg(pool);
    
    // Le pasamos el adaptador a la clase padre (PrismaClient)
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}