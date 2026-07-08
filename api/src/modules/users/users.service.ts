import { Injectable } from '@nestjs/common'; // ← limpio
import {
  UserNotFoundException,
  EmailAlreadyInUseException,
  IncorrectPasswordException,
} from './errors/users.errors';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import {
  CreateUserDto,
  UpdateUserDto,
  UpdatePasswordDto,
  AdminResetPasswordDto,
} from './schemas/user.schema';
import { type UserRole } from 'feedbackboard-shared';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      omit: { password: true },
      include: {
        ownedCommerces: {
          select: { id: true, name: true, slug: true, verified: true },
        },
      },
    });
    if (!user) throw new UserNotFoundException(id);

    const { ownedCommerces, ...rest } = user;
    return { ...rest, commerce: ownedCommerces };
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(
    data: CreateUserDto,
    tx?: Prisma.TransactionClient,
    role: UserRole = 'MEMBER',
  ) {
    const client = tx ?? this.prisma;
    const existingUser = await this.findByEmail(data.email); //
    if (existingUser) throw new EmailAlreadyInUseException();
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await client.user.create({
      data: { ...data, password: hashedPassword, role },
      omit: { password: true },
    });

    return user;
  }

  async update(id: string, data: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new UserNotFoundException(id);

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data,
      omit: { password: true },
    });

    return updatedUser;
  }

  async adminResetPassword(id: string, dto: AdminResetPasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new UserNotFoundException(id);
    const hashed = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({
      where: { id },
      data: { password: hashed },
    });

    return { success: true };
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new UserNotFoundException(id);

    await this.prisma.user.delete({ where: { id } });
    return { success: true };
  }

  async updatePassword(id: string, dto: UpdatePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new UserNotFoundException(id);

    const isMatch = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isMatch) throw new IncorrectPasswordException();

    const hashed = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.user.update({
      where: { id },
      data: { password: hashed },
    });

    return { success: true };
  }
}
