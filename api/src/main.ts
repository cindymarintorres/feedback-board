import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ZodValidationPipe } from 'nestjs-zod';
import { LoggingInterceptor } from './common/interceptors/interceptor.logging';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  app.setGlobalPrefix('api');

  // En desarrollo permitimos todo por conveniencia. 
  // En producción, tomamos los dominios permitidos desde la variable FRONTEND_URL.
  // Si en producción no se define FRONTEND_URL, bloqueamos el acceso (seguridad por defecto).
  const allowedOrigins = process.env.NODE_ENV === 'production'
    ? (process.env.VITE_API_URL ? process.env.VITE_API_URL.split(',').map(url => url.trim()) : [])
    : true;

  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  /*app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));*/

  app.useGlobalPipes(new ZodValidationPipe())
  app.useGlobalInterceptors(new LoggingInterceptor());

  await app.listen(port, '0.0.0.0')  // ← acepta conexiones desde fuera
  console.log(`Application is running on: http://localhost:${port}/api`);
}
bootstrap();