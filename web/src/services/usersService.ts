import { api } from "@/lib/api";
import {
  PublicUserSchema,
  type PublicUser,
  type UpdateUserDto,
  type UpdatePasswordDto,
} from "feedbackboard-shared";

export const usersService = {
  getById: async (id: string): Promise<PublicUser> => {
    const { data } = await api.get(`/users/${id}`);
    return PublicUserSchema.parse(data);
  },

  update: async (id: string, payload: UpdateUserDto): Promise<PublicUser> => {
    const { data } = await api.patch(`/users/${id}`, payload);
    return PublicUserSchema.parse(data);
  },

  adminResetPassword: async (id: string): Promise<{ success: boolean }> => {
    const { data } = await api.patch(`/users/${id}/password`);
    return data;
  },

  updatePassword: async (
    payload: UpdatePasswordDto,
  ): Promise<{ success: boolean }> => {
    const { data } = await api.patch(`/users/me/password`, payload);
    return data;
  },

  remove: async (id: string): Promise<{ success: boolean }> => {
    const { data } = await api.delete(`/users/${id}`);
    return data;
  },

  findAll: async (): Promise<PublicUser[]> => {
    const { data } = await api.get("/users");
    return PublicUserSchema.array().parse(data);
  },
};
