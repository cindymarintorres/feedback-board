import { Module } from '@nestjs/common'
import { CommerceReviewsController } from './commerce-reviews.controller'
import { CommerceReviewsService } from './commerce-reviews.service'

@Module({
  controllers: [CommerceReviewsController],
  providers: [CommerceReviewsService],
  exports: [CommerceReviewsService],
})
export class CommerceReviews {}