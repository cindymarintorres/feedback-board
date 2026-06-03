import { z } from 'zod'
import { PublicUserSchema } from './user.schema'


// --- Responses (lo que devuelve la API) ---
export const LoginResponseSchema = z.object({
  accessToken: z.string(),
  user: PublicUserSchema,
})

// --- Payloads base (reglas de negocio, sin mensajes de UX) ---
export const BaseLoginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
})

export const BaseRegisterSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(6),
})

export const BaseForgotPasswordSchema = z.object({
  email: z.email(),
})

export const BaseResetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(6),
})


// --- Tipos inferidos ---
export type LoginResponse = z.infer<typeof LoginResponseSchema>
export type LoginDto = z.infer<typeof BaseLoginSchema>
export type RegisterDto = z.infer<typeof BaseRegisterSchema>
export type ForgotPasswordDto = z.infer<typeof BaseForgotPasswordSchema>
export type ResetPasswordDto = z.infer<typeof BaseResetPasswordSchema>;