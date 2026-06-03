import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersService } from "@/services/usersService";
import type {
  UpdatePasswordDto,
  UpdateUserDto,
  PublicUser,
  AdminResetPasswordDto,
} from "feedbackboard-shared";
import { useAuth } from "./useAuth";

// utils o dentro del mismo archivo si solo se usa aquí
const cleanPayload = <T extends Record<string, unknown>>(
  payload: T,
): Partial<T> =>
  Object.fromEntries(
    Object.entries(payload).filter(([_key, value]) => value !== undefined),
  ) as Partial<T>;

export const useUpdateUser = () => {
  const { state, dispatch } = useAuth();
  const id = state.user!.id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateUserDto) => {
      const data = cleanPayload(payload);
      console.log("Datos a actualizar:", data);
      return usersService.update(id, data);
    },
    onSuccess: (updatedUser: PublicUser) => {
      console.log("Datos actualizados:" + updatedUser);
      dispatch({ type: "UPDATE_USER", payload: updatedUser });
      queryClient.invalidateQueries({ queryKey: ["user", id] });
    },
    onError: (error: Error) => {
      console.error("Update failed:", error);
    },
  });
};

export const useAdminResetPassword = () => {
  const { state } = useAuth();
  const id = state.user!.id;

  return useMutation({
    mutationFn: (payload: AdminResetPasswordDto) =>
      usersService.adminResetPassword(id, payload),
    onSuccess: () => {
      console.log("Contraseña reseteada correctamente");
    },
    onError: (error: Error) => {
      console.error("Password reset failed:", error);
    },
  });
};

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: (payload: UpdatePasswordDto) =>
      usersService.updatePassword(payload),
    onSuccess: () => {
      console.log("Contraseña actualizada correctamente");
    },
    onError: (error: Error) => {
      console.error("Password update failed:", error);
    },
  });
};
