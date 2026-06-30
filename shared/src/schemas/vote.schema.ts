import { z } from 'zod'

export const VoteTypeSchema = z.enum(['GOOD', 'REGULAR', 'BAD'])

export const CreateVoteSchema = z.object({
  type: VoteTypeSchema,
})

export type VoteType = z.infer<typeof VoteTypeSchema>
export type CreateVoteDto = z.infer<typeof CreateVoteSchema>