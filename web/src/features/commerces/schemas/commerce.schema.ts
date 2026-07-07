import { z } from 'zod'
import { BaseRegisterCommerceSchema } from 'feedbackboard-shared'

const RegisterCommerceExtended = BaseRegisterCommerceSchema.extend({
  email: z.email('Correo inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  commerceName: z.string().min(2, 'El nombre del comercio debe tener al menos 2 caracteres'),
  confirmPassword: z.string(),
})

type RegisterCommerceExtended = z.infer<typeof RegisterCommerceExtended>

export const RegisterCommerceFormSchema = RegisterCommerceExtended.refine(
  (data: RegisterCommerceExtended) => data.password === data.confirmPassword,
  { message: 'Las contraseñas no coinciden', path: ['confirmPassword'] }
)

// Omite confirmPassword para enviar a la API
export const RegisterCommercePayloadSchema = RegisterCommerceExtended.omit({
  confirmPassword: true,
})

export type RegisterCommerceFormData = z.infer<typeof RegisterCommerceFormSchema>
export type RegisterCommercePayload = z.infer<typeof RegisterCommercePayloadSchema>