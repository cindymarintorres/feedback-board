import { api } from "@/lib/api";
import {
  AddCommerceResponseSchema,
  CommerceResponseSchema,
  CreateOwnCommerceSchema,
  UpdateCommerceSchema,
} from "feedbackboard-shared";
import type {
  CreateOwnCommerceDto,
  AddCommerceResponseDto,
  UpdateCommerceDto,
  CommerceResponseDto,
} from "feedbackboard-shared";

export const commerceService = {
  addCommerce: async (
    payload: CreateOwnCommerceDto,
  ): Promise<AddCommerceResponseDto> => {
    const safePayload = CreateOwnCommerceSchema.parse(payload);
    const { data } = await api.post("/commerces/mine", safePayload);
    return AddCommerceResponseSchema.parse(data);
  },
  updateCommerce: async (
    id: string,
    payload: UpdateCommerceDto,
  ): Promise<AddCommerceResponseDto> => {
    const safePayload = UpdateCommerceSchema.parse(payload);
    const { data } = await api.patch(`/commerces/${id}`, safePayload);
    return AddCommerceResponseSchema.parse(data);
  },

  deleteCommerce: async (id: string): Promise<{ success: boolean }> => {
    const { data } = await api.delete(`/commerces/${id}`);
    return data;
  },
  getBySlug: async (slug: string): Promise<CommerceResponseDto> => {
    const { data } = await api.get(`/commerces/slug/${slug}`);
    return CommerceResponseSchema.parse(data);
  },
};
