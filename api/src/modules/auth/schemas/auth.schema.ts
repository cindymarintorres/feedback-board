import { createZodDto } from 'nestjs-zod'
import { BaseLoginSchema, BaseRegisterSchema, BaseResetPasswordSchema, BaseForgotPasswordSchema } from 'feedbackboard-shared'

export class LoginDto extends createZodDto(BaseLoginSchema) {}
export class RegisterDto extends createZodDto(BaseRegisterSchema) {}
export class ResetPasswordDto extends createZodDto(BaseResetPasswordSchema){}
export class ForgotPasswordDto extends createZodDto(BaseForgotPasswordSchema){}