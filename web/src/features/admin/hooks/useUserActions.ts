import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersService } from "@/services/usersService";

export function useUserActions() {
  const queryClient = useQueryClient();

  const resetPasswordMutation = useMutation({
    mutationFn: (id: string) => usersService.adminResetPassword(id),
  });

  const deactivateMutation = useMutation({
    mutationFn: (id: string) => usersService.deactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const activateMutation = useMutation({
    mutationFn: (id: string) => usersService.activate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => usersService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return {
    resetPasswordMutation,
    deactivateMutation,
    activateMutation,
    removeMutation,
  };
}
