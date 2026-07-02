import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CommerceNotFoundForSuggestionException,
  SuggestionNotFoundException,
} from './errors/suggestions.errors';
import { CreateSuggestionDto, Category } from './schemas/suggestions.schema';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class SuggestionsService {
  private readonly logger = new Logger(SuggestionsService.name);

  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('mail') private readonly mailQueue: Queue, // Cola
  ) {}

  async findByCommerce(
    commerceId: string,
    currentUserId: string,
    category: string,
    order: string,
  ) {
    const commerce = await this.prisma.commerce.findUnique({
      where: { id: commerceId },
      select: { id: true },
    });
    if (!commerce) throw new CommerceNotFoundForSuggestionException(commerceId);

    const suggestions = await this.prisma.suggestion.findMany({
      where: {
        commerceId,
        ...(category && { category: category as Category }),
      },
      include: {
        author: { select: { id: true, name: true, avatarUrl: true } },
        votes: { select: { userId: true, type: true } },
      },
      orderBy:
        order === 'most_voted'
          ? { votes: { _count: 'desc' } }
          : { createdAt: 'desc' },
    });

    return suggestions.map(({ votes, ...suggestion }) => ({
      ...suggestion,
      voteCounts: {
        GOOD: votes.filter((vote) => vote.type === 'GOOD').length,
        REGULAR: votes.filter((vote) => vote.type === 'REGULAR').length,
        BAD: votes.filter((vote) => vote.type === 'BAD').length,
      },
      userVote:
        votes.find((vote) => vote.userId === currentUserId)?.type ?? null,
    }));
  }

  async findById(id: string) {
    const suggestion = await this.prisma.suggestion.findUnique({
      where: { id },
    });
    if (!suggestion) throw new SuggestionNotFoundException(id);
    return suggestion;
  }

  async create(dto: CreateSuggestionDto, authorId: string) {
    const commerce = await this.prisma.commerce.findUnique({
      where: { id: dto.commerceId },
      select: { id: true },
    });
    if (!commerce)
      throw new CommerceNotFoundForSuggestionException(dto.commerceId);

    const suggestion = await this.prisma.suggestion.create({
      data: { ...dto, authorId },
    });

    this.logger.log(
      `Suggestion created: ${suggestion.id} by user: ${authorId}`,
    );

    const author = await this.prisma.user.findUnique({
      where: { id: authorId },
      select: { email: true, name: true },
    });
    
    if (author) {
      await this.mailQueue.add('suggestion-created', {
        email: author.email,
        name: author.name,
        title: suggestion.title,
      });
    }

    return suggestion;
  }

  async remove(id: string) {
    const suggestion = await this.prisma.suggestion.findUnique({
      where: { id },
    });
    if (!suggestion) throw new SuggestionNotFoundException(id);

    await this.prisma.suggestion.delete({ where: { id } });
    return { success: true };
  }
}
