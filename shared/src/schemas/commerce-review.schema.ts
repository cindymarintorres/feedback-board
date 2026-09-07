import { z } from 'zod'

export const CategorySchema = z.enum(['FEATURE', 'BUG', 'IMPROVEMENT', 'OTHER'])

export const CreateCommerceReviewSchema = z.object({
  stars: z.number().int().min(1, 'Mínimo 1 estrella').max(5, 'Máximo 5 estrellas'),
  category: CategorySchema.optional(),
  comment: z.string().min(1).optional(),
  commerceId: z.uuid('Comercio inválido'),
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
  commerce: z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
  }),
})

export const PlatformStatsQuerySchema = z.object({
  from: z.iso.datetime().optional(),
  to: z.iso.datetime().optional(),
});
export type PlatformStatsQueryDto = z.infer<typeof PlatformStatsQuerySchema>;

export const CommerceRankingItemSchema = z.object({
  commerceId: z.string(),
  name: z.string(),
  averageStars: z.number(),
  totalReviews: z.number(),
});

export const TrendPointSchema = z.object({
  date: z.string(), // "2026-08-27"
  averageStars: z.number(),
  totalReviews: z.number(),
});

export const PlatformStatsResponseSchema = z.object({
  totalUsers: z.number(),
  totalCommerces: z.number(),
  totalReviews: z.number(),
  averageStars: z.number(),
  topCommerces: z.array(CommerceRankingItemSchema),
  trend: z.array(TrendPointSchema),
});


export type CreateCommerceReviewDto = z.infer<typeof CreateCommerceReviewSchema>
export type CommerceReviewResponseDto = z.infer<typeof CommerceReviewResponseSchema>
export type Category = z.infer<typeof CategorySchema>
export type PlatformStatsResponseDto = z.infer<typeof PlatformStatsResponseSchema>;