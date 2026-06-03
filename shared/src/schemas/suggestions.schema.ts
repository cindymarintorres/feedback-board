import { z } from 'zod'

export const CategorySchema = z.enum(['FEATURE', 'BUG', 'IMPROVEMENT', 'OTHER'])
export const SuggestionStatusSchema = z.enum([
  'PENDING', 'UNDER_REVIEW', 'IN_PROGRESS', 'COMPLETED', 'REJECTED'
])

export const CreateSuggestionSchema = z.object({
  title: z.string().min(5, 'Mínimo 5 caracteres'),
  description: z.string().min(10, 'Mínimo 10 caracteres'),
  category: CategorySchema,
})

export const UpdateSuggestionStatusSchema = z.object({
  status: SuggestionStatusSchema,
})

export type CreateSuggestionDto = z.infer<typeof CreateSuggestionSchema>
export type UpdateSuggestionStatusDto = z.infer<typeof UpdateSuggestionStatusSchema>
export type Category = z.infer<typeof CategorySchema>
export type SuggestionStatus = z.infer<typeof SuggestionStatusSchema>