import { api } from "@/lib/api";
import { AddCommerceResponseSchema, CreateOwnCommerceSchema } from "feedbackboard-shared";
import type { CreateOwnCommerceDto, AddCommerceResponseDto } from "feedbackboard-shared";

export const commerceService = {
  addCommerce: async (payload: CreateOwnCommerceDto): Promise<AddCommerceResponseDto> => {
    const safePayload = CreateOwnCommerceSchema.parse(payload);
    const { data } = await api.post("/commerces/mine", safePayload);
    return AddCommerceResponseSchema.parse(data);
  },
};