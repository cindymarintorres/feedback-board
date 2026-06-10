import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class TokenCleanupService {
  private readonly logger = new Logger(TokenCleanupService.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async deleteExpiredTokens() {
    const { count } = await this.prisma.passwordResetToken.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });

    if (count > 0) {
      this.logger.log(`Tokens expirados eliminados: ${count}`);
    }
  }
}