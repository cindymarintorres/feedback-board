import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  VoteAlreadyExistsException,
  VoteNotFoundException,
  SuggestionNotFoundForVoteException,
} from './errors/votes.errors';
import { CreateVoteDto, UpdateVoteDto } from './schemas/votes.schema';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

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
}
