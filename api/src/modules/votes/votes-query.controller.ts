import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { VotesService } from './votes.service';
import { JwtUser, UserRoleValues } from 'feedbackboard-shared';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/role.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('votes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VotesQueryController {
  constructor(private readonly votesService: VotesService) {}

  @Get('mine')
  @Roles(UserRoleValues.MEMBER)
  findMine(@CurrentUser() currentUser: JwtUser) {
    return this.votesService.findByUser(currentUser.id);
  }

  @Get()
  @Roles(UserRoleValues.COMMERCE_ADMIN)
  findByCommerce(
    @Query('commerceId') commerceId: string,
    @CurrentUser() currentUser: JwtUser,
  ) {
    return this.votesService.findByCommerce(commerceId, currentUser.id, currentUser.role);
  }
}