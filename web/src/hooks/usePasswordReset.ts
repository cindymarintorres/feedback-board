import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { authService } from "@/services/authService";
import type { ForgotPasswordDto, ResetPasswordDto } from "feedbackboard-shared";

export const usePasswordReset = (token?: string) => {
  const navigate = useNavigate();

  const validateTokenQuery = useQuery({
    queryKey: ["validate-token", token],
    queryFn: () => authService.validateResetToken(token!),
    enabled: !!token,
    retry: false,
    staleTime: 0,
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: (payload: ForgotPasswordDto) =>
      authService.forgotPassword(payload),
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (payload: ResetPasswordDto) =>
      authService.resetPassword(payload),
    onSuccess: () => {
      setTimeout(() => navigate("/login"), 800);
    },
    onError(error: Error) {
      console.error("Reset Password failed:", error);
    },
  });

  return { validateTokenQuery, forgotPasswordMutation, resetPasswordMutation };
};
