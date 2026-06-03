import { z } from 'zod'

const envSchema = z.object({
  VITE_API_URL: z.string('VITE_API_URL debe ser una URL válida').min(1),
  VITE_PROXY_TARGET: z.string('VITE_PROXY_TARGET debe ser una URL válida').min(1),
})

const parsed = envSchema.safeParse({
  VITE_API_URL: import.meta.env.VITE_API_URL,
  VITE_PROXY_TARGET: import.meta.env.VITE_PROXY_TARGET,
})

if (!parsed.success) {
    const messages = parsed.error.issues
        .map((issue) => `  ${issue.path.join('.')}: ${issue.message}`)
        .join('\n');

    throw new Error(`\n Variables de entorno inválidas:\n${messages}\n`);
}

export const env = parsed.data