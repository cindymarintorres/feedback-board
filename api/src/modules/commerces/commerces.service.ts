import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CommerceNotFoundException,
  SlugAlreadyInUseException,
} from './errors/commerce.errors';
import {
  CreateCommerceDto,
  UpdateCommerceDto,
} from './schemas/commerce.schema';
import { ROUTES } from 'src/config/routes';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CommercesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
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

  async create(data: CreateCommerceDto, ownerId: string) {
    const existing = await this.prisma.commerce.findUnique({
      where: { slug: data.slug },
    });
    if (existing) throw new SlugAlreadyInUseException();

    const commerce = await this.prisma.commerce.create({
      data: { ...data, ownerId },
    });

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
}
