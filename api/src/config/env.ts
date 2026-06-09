import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().min(1),
  REDIS_HOST: z.string().min(1),
  REDIS_PORT: z.coerce.number().default(6379),
  JWT_SECRET: z.string().min(16),
  JWT_EXPIRES_IN: z.string().default('15m'),
  REFRESH_TOKEN_SECRET: z.string().min(16),
  REFRESH_TOKEN_EXPIRE_IN: z.string().default('7d'),
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.coerce.number().default(1025),
  SMTP_FROM: z.email(),
  SMTP_SECURE: z.coerce.boolean(), // coerce convierte "false" → false
  SMTP_IGNORE_TLS: z.coerce.boolean(), // coerce convierte "true" → true
  WEB_URL: z.string().min(1), // sin validar formato, acepta cualquier string,
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validate(config: Record<string, unknown>) {
  console.log('🔍 WEB_URL recibida:', config['WEB_URL']); // <-- agrega esto
  const result = envSchema.safeParse(config);

  if (!result.success) {
    // Zod 4: result.error.issues (ya no .flatten())
    const messages = result.error.issues
      .map((issue) => `  ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');

    throw new Error(`\n Variables de entorno inválidas:\n${messages}\n`);
  }

  return result.data;
}
