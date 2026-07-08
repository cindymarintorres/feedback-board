import { z } from 'zod'
import { BaseRegisterSchema } from './auth.schema'

export const BaseRegisterCommerceSchema = BaseRegisterSchema.extend({
  commerceName: z.string().trim().min(2),
  commerceDescription: z.string().optional(),
})

export const CommerceVerificationResponseSchema = z.object({
  message: z.string(),
  commerceId: z.string(),
})

export const CreateCommerceSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  slug: z.string()
    .min(2, 'Mínimo 2 caracteres')
    .regex(/^[a-z0-9-]+$/, 'Solo minúsculas, números y guiones'),
  description: z.string().optional(),
})

export const CreateOwnCommerceSchema = CreateCommerceSchema.omit({ slug: true })
export const UpdateCommerceSchema = CreateCommerceSchema.partial()

export const CommerceResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullish(),
  logoUrl: z.string().nullish(),
  ownerId: z.string(),
  verified: z.boolean(),
  feedbackUrl: z.string(), //Nota: feedbackUrl no es columna de la tabla — es el campo que agrega buildFeedbackUrl() en el service antes de responder. Por eso va en el schema de respuesta pero no en CreateCommerceSchema/UpdateCommerceSchema.
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export const AddCommerceResponseSchema = CommerceResponseSchema.omit({
  logoUrl: true,
  ownerId: true,
  feedbackUrl: true,
  createdAt: true,
  updatedAt: true,
})

export type AddCommerceResponseDto = z.infer<typeof AddCommerceResponseSchema>
export type CommerceResponseDto = z.infer<typeof CommerceResponseSchema>
export type RegisterCommerceDto = z.infer<typeof BaseRegisterCommerceSchema>
export type CreateCommerceDto = z.infer<typeof CreateCommerceSchema>
export type CreateOwnCommerceDto = z.infer<typeof CreateOwnCommerceSchema>
export type UpdateCommerceDto = z.infer<typeof UpdateCommerceSchema>