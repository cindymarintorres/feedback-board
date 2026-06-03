import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { authService } from "@/services/authService";
import { useAuth } from "@/hooks/useAuth";
import type { LoginDto, LoginResponse } from "feedbackboard-shared";

export const useLogin = () => {
  const navigate = useNavigate();
  const { dispatch } = useAuth();

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

  return { loginMutation };
};
