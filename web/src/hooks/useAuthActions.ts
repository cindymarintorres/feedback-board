import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { authService } from "@/services/authService";
import { useAuth } from "@/hooks/useAuth";
import type { LoginDto, LoginResponse } from "feedbackboard-shared";

export const useAuthActions = () => {
  const navigate = useNavigate();
  const { dispatch } = useAuth();
  const queryClient = useQueryClient();

  // ───Login ───────────────────────────────────────
  const loginMutation = useMutation({
    mutationFn: (payload: LoginDto) => authService.login(payload),
    onSuccess: (data: LoginResponse) => {
      dispatch({ type: "SET_LOADING", payload: true }); // spinner ON

      // Le decimos al guardia: "escribe esto en la pizarra"
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
    onSettled: () => {
      // onSettled corre tanto si éxito como si falla
      // así el usuario siempre queda deslogueado del lado cliente
      queryClient.clear(); // limpia cache de react-query
      dispatch({ type: "LOGOUT" });
      navigate("/login");
    },
  });

  return { loginMutation, logoutMutation };
};
