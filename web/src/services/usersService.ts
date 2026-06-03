import { api } from '@/lib/api'
import { PublicUserSchema, type PublicUser, type UpdateUserDto, type UpdatePasswordDto, type AdminResetPasswordDto } from 'feedbackboard-shared'

export const usersService = {
  getById: async (id: string): Promise<PublicUser> => {
    const { data } = await api.get(`/users/${id}`)
    return PublicUserSchema.parse(data)
  },

  update: async (id: string, payload: UpdateUserDto): Promise<PublicUser> => {
    const { data } = await api.patch(`/users/${id}`, payload)
    return PublicUserSchema.parse(data)
  },

  adminResetPassword: async (id: string, payload: AdminResetPasswordDto): Promise<{ success: boolean }> => {
    const { data } = await api.patch(`/users/${id}/password`, payload)
    return data
  },

  updatePassword: async (payload: UpdatePasswordDto): Promise<{ success: boolean }> => {
    const { data } = await api.patch(`/users/me/password`, payload)
    return data
  },
}