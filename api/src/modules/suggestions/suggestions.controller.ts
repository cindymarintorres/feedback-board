import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { SuggestionsService } from './suggestions.service';
import { CreateSuggestionDto } from './schemas/suggestions.schema';
import {
  CreateSuggestionSchema,
  JwtUser,
  UserRoleValues,
} from 'feedbackboard-shared';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/role.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@Controller('suggestions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SuggestionsController {
  constructor(private readonly suggestionsService: SuggestionsService) {}

  @Get()
  @Roles(
    UserRoleValues.MEMBER,
    UserRoleValues.COMMERCE_ADMIN,
    UserRoleValues.ADMIN,
  )
  findByCommerce(
    @Query('commerceId') commerceId: string,
    @Query('category') category: string,
    @Query('order') order: 'newest' | 'most_voted',
    @CurrentUser() currentUser: JwtUser,
  ) {
    return this.suggestionsService.findByCommerce(
      commerceId,
      currentUser.id,
      category,
      currentUser.role,
      order,
    );
  }

  @Get(':id')
  @Roles(
    UserRoleValues.MEMBER,
    UserRoleValues.COMMERCE_ADMIN,
    UserRoleValues.ADMIN,
  )
  findOne(@Param('id') id: string) {
    return this.suggestionsService.findById(id);
  }
  @Post()
  @Roles(UserRoleValues.MEMBER)
  create(
    @Body(new ZodValidationPipe(CreateSuggestionSchema))
    dto: CreateSuggestionDto,
    @CurrentUser() currentUser: JwtUser,
  ) {
    return this.suggestionsService.create(dto, currentUser.id);
  }

  @Delete(':id')
  @Roles(UserRoleValues.MEMBER, UserRoleValues.ADMIN)
  async remove(@Param('id') id: string, @CurrentUser() currentUser: JwtUser) {
    if (currentUser.role !== UserRoleValues.ADMIN) {
      const suggestion = await this.suggestionsService.findById(id);
      if (suggestion.authorId !== currentUser.id) {
        throw new ForbiddenException(
          'No tienes permiso para eliminar esta sugerencia',
        );
      }
    }
    return this.suggestionsService.remove(id);
  }
}
