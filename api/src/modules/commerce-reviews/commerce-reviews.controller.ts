import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { CommerceReviewsService } from './commerce-reviews.service';
import { CreateCommerceReviewDto } from './schemas/commerce-review.schema';
import {
  CreateCommerceReviewSchema,
  JwtUser,
  UserRoleValues,
  Order,
} from 'feedbackboard-shared';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/role.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('commerce-reviews')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CommerceReviewsController {
  constructor(private readonly reviewsService: CommerceReviewsService) {}

  @Post()
  @Roles(UserRoleValues.MEMBER)
  create(
    @Body(new ZodValidationPipe(CreateCommerceReviewSchema))
    dto: CreateCommerceReviewDto,
    @CurrentUser() currentUser: JwtUser,
  ) {
    return this.reviewsService.create(dto, currentUser.id);
  }

  @Get()
  @Roles(UserRoleValues.COMMERCE_ADMIN, UserRoleValues.ADMIN)
  findByCommerce(
    @Query('commerceId') commerceId: string,
    @Query('order') order: Order,
    @CurrentUser() currentUser: JwtUser,
  ) {
    return this.reviewsService.findByCommerce(
      commerceId,
      currentUser.id,
      currentUser.role,
      order,
    );
  }
}
