import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'
import {
  BaseLoginSchema,
  BaseRegisterSchema,
  BaseResetPasswordSchema,
  BaseForgotPasswordSchema,
  LoginResponseSchema,
} from 'feedbackboard-shared'

export class LoginDto extends createZodDto(BaseLoginSchema) {}
export class RegisterDto extends createZodDto(BaseRegisterSchema) {}
export class ResetPasswordDto extends createZodDto(BaseResetPasswordSchema){}
export class ForgotPasswordDto extends createZodDto(BaseForgotPasswordSchema){}

// Extiende el schema compartido con el refreshToken que el backend
// genera y le pasa al controlador para meterlo en la cookie HTTPOnly.
// El frontend NUNCA recibe este campo.
export const AuthResultSchema = LoginResponseSchema.extend({
  refreshToken: z.string(),
})

export type AuthResult = z.infer<typeof AuthResultSchema>