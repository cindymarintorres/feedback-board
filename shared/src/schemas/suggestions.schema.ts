import { z } from 'zod'

export const CategorySchema = z.enum(['FEATURE', 'BUG', 'IMPROVEMENT', 'OTHER'])

export const CreateSuggestionSchema = z.object({
  title: z.string().min(5, 'Mínimo 5 caracteres'),
  description: z.string().min(10, 'Mínimo 10 caracteres'),
  category: CategorySchema,
  commerceId: z.string().uuid('Comercio inválido'),
})

export type CreateSuggestionDto = z.infer<typeof CreateSuggestionSchema>
export type Category = z.infer<typeof CategorySchema>