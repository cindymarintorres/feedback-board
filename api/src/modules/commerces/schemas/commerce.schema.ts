import { createZodDto } from 'nestjs-zod';
import {
  CreateCommerceSchema,
  UpdateCommerceSchema,
  BaseRegisterCommerceSchema,
  CommerceResponseSchema,
} from 'feedbackboard-shared';

export class CreateCommerceDto extends createZodDto(CreateCommerceSchema) {}
export class UpdateCommerceDto extends createZodDto(UpdateCommerceSchema) {}
export class RegisterCommerceDto extends createZodDto(
  BaseRegisterCommerceSchema,
) {}
export class CommerceResponseDto extends createZodDto(CommerceResponseSchema) {}
