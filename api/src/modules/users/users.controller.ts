import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  AdminResetPasswordSchema,
  JwtUser,
  UpdatePasswordSchema,
  UpdateUserSchema,
} from 'feedbackboard-shared';
import { AdminResetPasswordDto, UpdatePasswordDto, UpdateUserDto } from './schemas/user.schema';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/role.decorator';
import { UserRoleValues } from 'feedbackboard-shared';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRoleValues.ADMIN)
  findAll() {
    //List Users
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles(UserRoleValues.MEMBER)
  findOne(@Param('id') id: string, @CurrentUser() currentUser: JwtUser) {
    //List User
    if (currentUser.role !== 'ADMIN' && currentUser.id !== id) {
      throw new ForbiddenException('No tienes permiso para ver este perfil');
    }
    return this.usersService.findById(id);
  }

  @Patch(':id')
  @Roles(UserRoleValues.MEMBER)
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateUserSchema)) updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: JwtUser,
  ) {
    //Update User
    if (currentUser.role !== 'ADMIN' && currentUser.id !== id) {
      throw new ForbiddenException('No tienes permiso para editar este perfil');
    }
    return this.usersService.update(id, updateUserDto);
  }

  // Usuario cambia su propia contraseña — id del JWT
  @Patch('me/password')
  @Roles(UserRoleValues.MEMBER)
  updateMyPassword(
    @Body(new ZodValidationPipe(UpdatePasswordSchema)) dto: UpdatePasswordDto,
    @CurrentUser() currentUser: JwtUser,
  ) {
    return this.usersService.updatePassword(currentUser.id, dto);
  }

  // Admin resetea la contraseña de cualquier usuario — sin currentPassword
  @Patch(':id/password')
  @Roles(UserRoleValues.ADMIN)
  adminResetPassword(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(AdminResetPasswordSchema))
    dto: AdminResetPasswordDto,
  ) {
    return this.usersService.adminResetPassword(id, dto);
  }

  @Delete(':id')
  @Roles(UserRoleValues.ADMIN)
  remove(@Param('id') id: string) {
    //Delete User
    return this.usersService.remove(id);
  }
}
