import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CommerceNotFoundException,
  SlugAlreadyInUseException,
  CommerceVerificationTokenNotFoundException,
  CommerceVerificationTokenExpiredException,
} from './errors/commerce.errors';
import {
  CreateCommerceDto,
  CreateOwnCommerceDto,
  RegisterCommerceDto,
  UpdateCommerceDto,
} from './schemas/commerce.schema';
import { ROUTES } from 'src/config/routes';
import { ConfigService } from '@nestjs/config';
import { Prisma } from 'generated/prisma/client';
import * as crypto from 'crypto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { UsersService } from '../users/users.service';
@Injectable()
export class CommercesService {
  private readonly logger = new Logger(CommercesService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly usersService: UsersService,
    @InjectQueue('mail') private readonly mailQueue: Queue, // Cola
  ) {}

  async findAll(currentUserId: string, isAdmin: boolean) {
    const commerces = await this.prisma.commerce.findMany({
      where: isAdmin ? {} : { ownerId: currentUserId },
      orderBy: { createdAt: 'desc' },
    });

    return commerces.map((commerce) => ({
      ...commerce,
      feedbackUrl: this.buildFeedbackUrl(commerce.slug),
    }));
  }

  async findById(id: string) {
    const commerce = await this.prisma.commerce.findUnique({ where: { id } });
    if (!commerce) throw new CommerceNotFoundException(id);
    return { ...commerce, feedbackUrl: this.buildFeedbackUrl(commerce.slug) };
  }

  async findBySlug(slug: string) {
    const commerce = await this.prisma.commerce.findUnique({ where: { slug } });
    if (!commerce) throw new CommerceNotFoundException();
    return commerce;
  }

  async create(
    data: CreateCommerceDto,
    ownerId: string,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    const existing = await client.commerce.findUnique({
      where: { slug: data.slug },
    });
    if (existing) throw new SlugAlreadyInUseException();

    const commerce = await client.commerce.create({
      data: { ...data, ownerId },
    });

    return { ...commerce, feedbackUrl: this.buildFeedbackUrl(commerce.slug) };
  }

  async addCommerce(dto: CreateOwnCommerceDto, ownerId: string) {
    const slug = await this.generateUniqueSlug(dto.name);

    const commerce = await this.prisma.commerce.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description,
        ownerId,
        verified: true,
      },
    });

    this.logger.log(`Commerce added: ${commerce.id} by owner: ${ownerId}`);

    return { ...commerce, feedbackUrl: this.buildFeedbackUrl(commerce.slug) };
  }

  async update(id: string, data: UpdateCommerceDto) {
    const commerce = await this.prisma.commerce.findUnique({ where: { id } });
    if (!commerce) throw new CommerceNotFoundException(id);

    if (data.slug && data.slug !== commerce.slug) {
      const existing = await this.prisma.commerce.findUnique({
        where: { slug: data.slug },
      });
      if (existing) throw new SlugAlreadyInUseException();
    }

    return this.prisma.commerce.update({ where: { id }, data });
  }

  async remove(id: string) {
    const commerce = await this.prisma.commerce.findUnique({ where: { id } });
    if (!commerce) throw new CommerceNotFoundException(id);

    await this.prisma.commerce.delete({ where: { id } });
    return { success: true };
  }

  private buildFeedbackUrl(slug: string): string {
    const webUrl = this.config.getOrThrow<string>('WEB_URL');
    return `${webUrl}${ROUTES.feedback}/${slug}`;
  }

  private generateSlug(commerceName: string): string {
    return commerceName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  private async generateUniqueSlug(name: string): Promise<string> {
    let slug = this.generateSlug(name);
    let existing = await this.prisma.commerce.findUnique({ where: { slug } });
    while (existing) {
      slug = `${this.generateSlug(name)}-${crypto.randomBytes(2).toString('hex')}`;
      existing = await this.prisma.commerce.findUnique({ where: { slug } });
    }
    return slug;
  }

  private generateVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  async registerWithOwner(dto: RegisterCommerceDto) {
    const { commerceName, commerceDescription, ...userData } = dto;

    return this.prisma.$transaction(async (tx) => {
      const user = await this.usersService.create(
        userData,
        tx,
        'COMMERCE_ADMIN',
      );

      const slug = await this.generateUniqueSlug(commerceName);

      const commerce = await this.create(
        { name: commerceName, slug, description: commerceDescription },
        user.id,
        tx,
      );

      const token = this.generateVerificationToken();
      await tx.commerceVerificationToken.create({
        data: {
          token,
          commerceId: commerce.id,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      });

      await this.mailQueue.add('commerce-verify', {
        email: user.email,
        name: user.name,
        commerceName: commerce.name,
        token,
      });

      return { user, commerce };
    });
  }

  async verifyCommerce(token: string) {
    const record = await this.prisma.commerceVerificationToken.findUnique({
      where: { token },
    });

    if (!record) throw new CommerceVerificationTokenNotFoundException();
    if (record.expiresAt < new Date())
      throw new CommerceVerificationTokenExpiredException();

    await this.prisma.$transaction([
      this.prisma.commerce.update({
        where: { id: record.commerceId },
        data: { verified: true },
      }),
      this.prisma.commerceVerificationToken.delete({ where: { token } }),
    ]);

    return {
      message: 'Comercio verificado correctamente',
      commerceId: record.commerceId,
    };
  }
}
