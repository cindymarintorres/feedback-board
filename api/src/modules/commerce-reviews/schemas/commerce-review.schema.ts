import { createZodDto } from 'nestjs-zod';

import { CreateCommerceReviewSchema } from 'feedbackboard-shared'

export class CreateCommerceReviewDto extends createZodDto(CreateCommerceReviewSchema) {}