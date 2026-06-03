import { createZodDto } from 'nestjs-zod'
import {
  CreateUserSchema,
  UpdatePasswordSchema,
  UpdateUserSchema,
  AdminResetPasswordSchema
} from 'feedbackboard-shared'

export class CreateUserDto extends createZodDto(CreateUserSchema) {}
export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}
export class UpdatePasswordDto extends createZodDto(UpdatePasswordSchema) {}
export class AdminResetPasswordDto extends createZodDto(AdminResetPasswordSchema) {}