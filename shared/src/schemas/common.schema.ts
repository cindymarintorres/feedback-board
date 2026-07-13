import { z } from 'zod'

export const OrderSchema = z.enum(['newest', 'oldest'])
export type Order = z.infer<typeof OrderSchema>