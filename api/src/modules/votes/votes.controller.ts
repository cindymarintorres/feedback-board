import {
  Controller,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common'
import { VotesService } from './votes.service'
import { CreateVoteDto, UpdateVoteDto } from './schemas/votes.schema'
import {
  CreateVoteSchema,
  UpdateVoteSchema,
  JwtUser,
  UserRoleValues,
} from 'feedbackboard-shared'
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { RolesGuard } from '../../common/guards/roles.guard'
import { Roles } from '../../common/decorators/role.decorator'
import { CurrentUser } from '../../common/decorators/current-user.decorator'

@Controller('suggestions/:suggestionId/votes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoleValues.MEMBER)
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Post()
  create(
    @Param('suggestionId') suggestionId: string,
    @Body(new ZodValidationPipe(CreateVoteSchema)) dto: CreateVoteDto,
    @CurrentUser() currentUser: JwtUser,
  ) {
    return this.votesService.create(suggestionId, currentUser.id, dto)
  }

  @Patch()
  update(
    @Param('suggestionId') suggestionId: string,
    @Body(new ZodValidationPipe(UpdateVoteSchema)) dto: UpdateVoteDto,
    @CurrentUser() currentUser: JwtUser,
  ) {
    return this.votesService.update(suggestionId, currentUser.id, dto)
  }

  @Delete()
  remove(
    @Param('suggestionId') suggestionId: string,
    @CurrentUser() currentUser: JwtUser,
  ) {
    return this.votesService.remove(suggestionId, currentUser.id)
  }
}