import { api } from "@/lib/api";
import {
  CreateCommerceReviewSchema,
  CommerceReviewResponseSchema,
} from "feedbackboard-shared";
import type {
  CreateCommerceReviewDto,
  CommerceReviewResponseDto,
  Order,
} from "feedbackboard-shared";

export const commerceReviewService = {
  create: async (
    payload: CreateCommerceReviewDto,
  ): Promise<CommerceReviewResponseDto> => {
    const safePayload = CreateCommerceReviewSchema.parse(payload);
    const { data } = await api.post("/commerce-reviews", safePayload);
    return CommerceReviewResponseSchema.parse(data);
  },

  // commerceId y order son obligatorios en el backend (Query params sin default)
  findReviews: async ({
    commerceId,
    ownerId,
    order,
  }: {
    commerceId?: string;
    ownerId?: string;
    order: Order;
  }): Promise<CommerceReviewResponseDto[]> => {
    const { data } = await api.get("/commerce-reviews", {
      params: { commerceId, ownerId, order },
    });
    return CommerceReviewResponseSchema.array().parse(data);
  },
};
