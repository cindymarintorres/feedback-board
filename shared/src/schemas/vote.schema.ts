import { z } from 'zod'

export const VoteTypeSchema = z.enum(['GOOD', 'REGULAR', 'BAD'])

export const CreateVoteSchema = z.object({
  type: VoteTypeSchema,
})

// PATCH /suggestions/:id/votes — misma forma, alias explícito para claridad
export const UpdateVoteSchema = CreateVoteSchema

export type VoteType = z.infer<typeof VoteTypeSchema>
export type CreateVoteDto = z.infer<typeof CreateVoteSchema>
export type UpdateVoteDto = z.infer<typeof UpdateVoteSchema>