import { createZodDto } from 'nestjs-zod'
import { CreateCommerceSchema, UpdateCommerceSchema } from 'feedbackboard-shared'

export class CreateCommerceDto extends createZodDto(CreateCommerceSchema) {}
export class UpdateCommerceDto extends createZodDto(UpdateCommerceSchema) {}