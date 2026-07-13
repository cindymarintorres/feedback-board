import { z } from 'zod'

export const CategorySchema = z.enum(['FEATURE', 'BUG', 'IMPROVEMENT', 'OTHER'])

export const CreateCommerceReviewSchema = z.object({
  stars: z.number().int().min(1, 'Mínimo 1 estrella').max(5, 'Máximo 5 estrellas'),
  category: CategorySchema.optional(),
  comment: z.string().min(1).optional(),
  commerceId: z.string().uuid('Comercio inválido'),
})

export const CommerceReviewResponseSchema = z.object({
  id: z.string(),
  stars: z.number(),
  category: CategorySchema.nullable(),
  comment: z.string().nullable(),
  authorId: z.string(),
  commerceId: z.string(),
  createdAt: z.coerce.date(),
  author: z.object({
    id: z.string(),
    name: z.string(),
    avatarUrl: z.string().nullish(),
  }),
})

export type CreateCommerceReviewDto = z.infer<typeof CreateCommerceReviewSchema>
export type CommerceReviewResponseDto = z.infer<typeof CommerceReviewResponseSchema>
export type Category = z.infer<typeof CategorySchema>