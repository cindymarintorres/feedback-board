import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards
} from '@nestjs/common';
import { CommercesService } from './commerces.service';
import {
  CreateCommerceDto,
  CreateOwnCommerceDto,
  UpdateCommerceDto,
} from './schemas/commerce.schema';
import {
  CreateCommerceSchema,
  UpdateCommerceSchema,
  JwtUser,
  UserRoleValues,
  CreateOwnCommerceSchema,
} from 'feedbackboard-shared';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/role.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('commerces')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CommercesController {
  constructor(private readonly commercesService: CommercesService) {}

  @Get()
  @Roles(UserRoleValues.ADMIN, UserRoleValues.COMMERCE_ADMIN)
  findAll(@CurrentUser() currentUser: JwtUser) {
    const isAdmin = currentUser.role === UserRoleValues.ADMIN;
    return this.commercesService.findAll(currentUser.id, isAdmin);
  }

  @Get(':id')
  @Roles(UserRoleValues.ADMIN, UserRoleValues.COMMERCE_ADMIN)
  findOne(@Param('id') id: string) {
    return this.commercesService.findById(id);
  }

  // Ruta Pública — usada por /feedback/:slug, sin guards de rol
  @Public()
  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.commercesService.findBySlug(slug);
  }

  @Post()
  @Roles(UserRoleValues.ADMIN)
  create(
    @Body(new ZodValidationPipe(CreateCommerceSchema)) dto: CreateCommerceDto,
    @CurrentUser() currentUser: JwtUser,
  ) {
    return this.commercesService.create(dto, currentUser.id);
  }

  @Post('mine')
  @Roles(UserRoleValues.COMMERCE_ADMIN)
  addCommerce(
    @Body(new ZodValidationPipe(CreateOwnCommerceSchema))
    dto: CreateOwnCommerceDto,
    @CurrentUser() currentUser: JwtUser,
  ) {
    return this.commercesService.addCommerce(dto, currentUser.id);
  }

  @Patch(':id')
  @Roles(UserRoleValues.ADMIN, UserRoleValues.COMMERCE_ADMIN)
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateCommerceSchema)) dto: UpdateCommerceDto,
    @CurrentUser() currentUser: JwtUser,
  ) {
    const isAdmin = currentUser.role === UserRoleValues.ADMIN;
    return this.commercesService.update(id, dto, currentUser.id, isAdmin);
  }

  @Delete(':id')
  @Roles(UserRoleValues.ADMIN, UserRoleValues.COMMERCE_ADMIN)
  remove(@Param('id') id: string, @CurrentUser() currentUser: JwtUser) {
    const isAdmin = currentUser.role === UserRoleValues.ADMIN;
    return this.commercesService.remove(id, currentUser.id, isAdmin);
  }
}
