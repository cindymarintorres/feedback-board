import { z } from 'zod'
import { BaseForgotPasswordSchema, BaseLoginSchema, BaseRegisterSchema, BaseResetPasswordSchema } from 'feedbackboard-shared'

// --- Login con mensajes de UX ---
export const LoginSchema = BaseLoginSchema.extend({
  email: z.email('Correo inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

// --- Register con mensajes de UX + confirmPassword ---
const RegisterExtended = BaseRegisterSchema.extend({
  email: z.email('Correo inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  confirmPassword: z.string(),
})

type RegisterExtended = z.infer<typeof RegisterExtended>

export const RegisterFormSchema = RegisterExtended.refine(
  (data: RegisterExtended) => data.password === data.confirmPassword,
  { message: 'Las contraseñas no coinciden', path: ['confirmPassword'] }
)

// Omite confirmPassword para enviar a la API
export const RegisterPayloadSchema = RegisterExtended.omit({
  confirmPassword: true,
})

// ─── Reset Password ───────────────────────────────
const ResetExtended = BaseResetPasswordSchema.omit({ token: true }).extend({
  //token: z.string().min(1, 'El token es requerido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string(),
})

type ResetExtended = z.infer<typeof ResetExtended>

export const ResetPasswordFormSchema = ResetExtended.refine(
  (data: ResetExtended) => data.password === data.confirmPassword,
  { message: 'Las contraseñas no coinciden', path: ['confirmPassword'] }
)

// Lo que se envía a la API (sin confirmPassword)
export const ResetPasswordPayloadSchema = BaseResetPasswordSchema;

// ─── Forgot Password ─────────────────────────────
export const ForgotPasswordFormSchema = BaseForgotPasswordSchema.extend({
  email: z.email('Correo inválido'),
})


// --- Tipos inferidos ---
export type LoginFormData = z.infer<typeof LoginSchema>
export type RegisterFormData = z.infer<typeof RegisterFormSchema>
export type RegisterPayload = z.infer<typeof RegisterPayloadSchema>
export type ResetPasswordFormData = z.infer<typeof ResetPasswordFormSchema>
export type ForgotPasswordFormData = z.infer<typeof ForgotPasswordFormSchema>
