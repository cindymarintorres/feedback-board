import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { JwtUser } from 'feedbackboard-shared'

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user: JwtUser }>()
    return request.user
  },
)