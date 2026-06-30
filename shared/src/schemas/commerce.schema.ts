import { z } from 'zod'

export const CreateCommerceSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  slug: z.string()
    .min(2, 'Mínimo 2 caracteres')
    .regex(/^[a-z0-9-]+$/, 'Solo minúsculas, números y guiones'),
  description: z.string().optional(),
})

export const UpdateCommerceSchema = CreateCommerceSchema.partial()

export type CreateCommerceDto = z.infer<typeof CreateCommerceSchema>
export type UpdateCommerceDto = z.infer<typeof UpdateCommerceSchema>