import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { authService } from "@/services/authService";
import { useAuth } from "@/hooks/useAuth";
import type { LoginDto, LoginResponse } from "feedbackboard-shared";
import { tokenStore } from "@/lib/tokenStore";

export const useAuthActions = () => {
  const navigate = useNavigate();
  const { dispatch } = useAuth();
  const queryClient = useQueryClient();

  // ───Login ───────────────────────────────────────
  const loginMutation = useMutation({
    mutationFn: (payload: LoginDto) => authService.login(payload),
    onSuccess: (data: LoginResponse) => {
      dispatch({ type: "SET_LOADING", payload: true }); // spinner ON

      tokenStore.set(data.accessToken); //← interceptor ya puede leer el token

      dispatch({
        type: "LOGIN",
        payload: { user: data.user, token: data.accessToken },
      }); // spinner OFF aquí

      setTimeout(() => {
        navigate("/board");
        dispatch({ type: "SET_LOADING", payload: false });
      }, 800); //da tiempo al spinner de mostrarse
    },
    onError(error: Error) {
      dispatch({ type: "SET_LOADING", payload: false }); //spinner OFF en error
      console.error("Login failed:", error);
    },
  });

  // ─── Logout ───────────────────────────────────────
  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onMutate: () => {
      dispatch({ type: "SET_LOADING", payload: true }); // spinner ON inmediato
    },
    onSettled: () => {
      queryClient.clear();
      setTimeout(() => {
        dispatch({ type: "LOGOUT" }); // spinner OFF aquí
        navigate("/login");
      }, 800);
    },
  });

  return { loginMutation, logoutMutation };
};
