import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  VoteAlreadyExistsException,
  VoteNotFoundException,
  SuggestionNotFoundForVoteException,
  CommerceNotFoundForVoteException,
} from './errors/votes.errors';
import { CreateVoteDto, UpdateVoteDto } from './schemas/votes.schema';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { UserRole, UserRoleValues } from 'feedbackboard-shared';

@Injectable()
export class VotesService {
  private readonly logger = new Logger(VotesService.name);

  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('mail') private readonly mailQueue: Queue, // Cola
  ) {}

  private async assertSuggestionExists(suggestionId: string) {
    const suggestion = await this.prisma.suggestion.findUnique({
      where: { id: suggestionId },
      select: { id: true },
    });
    if (!suggestion) throw new SuggestionNotFoundForVoteException(suggestionId);
  }

  async create(suggestionId: string, userId: string, dto: CreateVoteDto) {
    await this.assertSuggestionExists(suggestionId);

    const existing = await this.prisma.vote.findUnique({
      where: { userId_suggestionId: { userId, suggestionId } },
    });
    if (existing) throw new VoteAlreadyExistsException();

    const vote = await this.prisma.vote.create({
      data: { userId, suggestionId, type: dto.type },
    });

    this.logger.log(`Vote created: ${vote.id} by user: ${userId}`);

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true },
    });
    if (user) {
      await this.mailQueue.add('vote-created', {
        email: user.email,
        name: user.name,
        type: dto.type,
      });
    }

    return vote;
  }

  async update(suggestionId: string, userId: string, dto: UpdateVoteDto) {
    await this.assertSuggestionExists(suggestionId);

    const existing = await this.prisma.vote.findUnique({
      where: { userId_suggestionId: { userId, suggestionId } },
    });
    if (!existing) throw new VoteNotFoundException();

    return this.prisma.vote.update({
      where: { userId_suggestionId: { userId, suggestionId } },
      data: { type: dto.type },
    });
  }

  async remove(suggestionId: string, userId: string) {
    await this.assertSuggestionExists(suggestionId);

    const existing = await this.prisma.vote.findUnique({
      where: { userId_suggestionId: { userId, suggestionId } },
    });
    if (!existing) throw new VoteNotFoundException();

    await this.prisma.vote.delete({
      where: { userId_suggestionId: { userId, suggestionId } },
    });
    return { success: true };
  }

  async findByUser(userId: string) {
    return this.prisma.vote.findMany({
      where: { userId },
      include: {
        suggestion: {
          select: {
            id: true,
            title: true,
            category: true,
            commerce: { select: { id: true, name: true, slug: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByCommerce(
    commerceId: string,
    currentUserId: string,
    currentUserRole: UserRole,
  ) {
    const commerce = await this.prisma.commerce.findUnique({
      where: { id: commerceId },
      select: { id: true, ownerId: true },
    });
    if (!commerce) throw new CommerceNotFoundForVoteException(commerceId);

    if (
      currentUserRole === UserRoleValues.COMMERCE_ADMIN &&
      commerce.ownerId !== currentUserId
    ) {
      throw new ForbiddenException('No tienes acceso a este comercio');
    }

    return this.prisma.vote.findMany({
      where: { suggestion: { commerceId } },
      include: {
        suggestion: { select: { id: true, title: true, category: true } },
        user: { select: { id: true, name: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
