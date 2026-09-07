import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CommerceNotFoundForReviewException,
  ReviewAlreadyExistsException,
} from './errors/commerce-reviews.errors';
import { CreateCommerceReviewDto } from './schemas/commerce-review.schema';
import { UserRole, UserRoleValues, Order } from 'feedbackboard-shared';

@Injectable()
export class CommerceReviewsService {
  private readonly logger = new Logger(CommerceReviewsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCommerceReviewDto, authorId: string) {
    const commerce = await this.prisma.commerce.findUnique({
      where: { id: dto.commerceId },
      select: { id: true },
    });
    if (!commerce) throw new CommerceNotFoundForReviewException(dto.commerceId);

    const existing = await this.prisma.commerceReview.findUnique({
      where: { authorId_commerceId: { authorId, commerceId: dto.commerceId } },
    });
    if (existing) throw new ReviewAlreadyExistsException();

    const review = await this.prisma.commerceReview.create({
      data: { ...dto, authorId },
      include: {
        author: { select: { id: true, name: true, avatarUrl: true } },
        commerce: { select: { id: true, name: true, slug: true } },
      },
    });

    this.logger.log(`Review created: ${review.id} by user: ${authorId}`);

    return review;
  }

  async findReviews(
    currentUserId: string,
    currentUserRole: UserRole,
    order: Order,
    commerceId?: string,
    ownerId?: string,
  ) {
    const orderBy = {
      createdAt: order === 'oldest' ? ('asc' as const) : ('desc' as const),
    };
    const include = {
      author: { select: { id: true, name: true, avatarUrl: true } },
      commerce: { select: { id: true, name: true, slug: true } },
    };

    if (currentUserRole === UserRoleValues.MEMBER) {
      return this.prisma.commerceReview.findMany({
        where: { authorId: currentUserId },
        include,
        orderBy,
      });
    }

    if (currentUserRole === UserRoleValues.COMMERCE_ADMIN) {
      if (!commerceId) throw new BadRequestException('commerceId es requerido');
      const commerce = await this.prisma.commerce.findUnique({
        where: { id: commerceId },
        select: { id: true, ownerId: true },
      });
      if (!commerce) throw new CommerceNotFoundForReviewException(commerceId);
      if (commerce.ownerId !== currentUserId) {
        throw new ForbiddenException('No tienes acceso a este comercio');
      }
      return this.prisma.commerceReview.findMany({
        where: { commerceId },
        include,
        orderBy,
      });
    }

    // ADMIN
    if (!ownerId) throw new BadRequestException('userId es requerido');
    return this.prisma.commerceReview.findMany({
      where: { commerce: { ownerId } },
      include,
      orderBy,
    });
  }

  async getPlatformStats(from?: string, to?: string) {
    const where = {
      ...(from || to
        ? {
            createdAt: {
              ...(from ? { gte: new Date(from) } : {}),
              ...(to ? { lte: new Date(to) } : {}),
            },
          }
        : {}),
    };

    const [totalUsers, totalCommerces, aggregate, ranking, rawReviews] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.commerce.count(),
        this.prisma.commerceReview.aggregate({
          where,
          _avg: { stars: true },
          _count: { _all: true },
        }),
        this.prisma.commerceReview.groupBy({
          by: ['commerceId'],
          where,
          _avg: { stars: true },
          _count: { _all: true },
          orderBy: { _avg: { stars: 'desc' } },
          take: 10,
        }),
        this.prisma.commerceReview.findMany({
          where,
          select: { stars: true, createdAt: true },
        }),
      ]);

    const commerceIds = ranking.map((r) => r.commerceId);
    const commerces = await this.prisma.commerce.findMany({
      where: { id: { in: commerceIds } },
      select: { id: true, name: true },
    });
    const nameById = new Map(commerces.map((c) => [c.id, c.name]));

    const topCommerces = ranking.map((r) => ({
      commerceId: r.commerceId,
      name: nameById.get(r.commerceId) ?? 'Desconocido',
      averageStars: r._avg.stars ?? 0,
      totalReviews: r._count._all,
    }));

    const trendMap = new Map<string, { sum: number; count: number }>();
    for (const review of rawReviews) {
      const day = review.createdAt.toISOString().slice(0, 10);
      const entry = trendMap.get(day) ?? { sum: 0, count: 0 };
      entry.sum += review.stars;
      entry.count += 1;
      trendMap.set(day, entry);
    }
    const trend = [...trendMap.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, { sum, count }]) => ({
        date,
        averageStars: sum / count,
        totalReviews: count,
      }));

    return {
      totalUsers,
      totalCommerces,
      totalReviews: aggregate._count._all,
      averageStars: aggregate._avg.stars ?? 0,
      topCommerces,
      trend,
    };
  }
}
