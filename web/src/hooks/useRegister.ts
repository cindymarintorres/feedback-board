import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { authService } from "@/services/authService";
import { useAuth } from "@/hooks/useAuth";
import type { RegisterDto } from "feedbackboard-shared";

export const useRegister = () => {
  const navigate = useNavigate();
  const { dispatch } = useAuth();

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterDto) => authService.register(payload),
    onSuccess: async (_: unknown, variables: RegisterDto) => {
      
      dispatch({ type: "SET_LOADING", payload: true }); // spinner ON

      // Auto-login tras registro exitoso
      const loginData = await authService.login({
        email: variables.email,
        password: variables.password,
      });

      // Mismo dispatch que en useLogin
      dispatch({
        type: "LOGIN",
        payload: {
          user: loginData.user,
          token: loginData.accessToken,
        },
      }); // spinner OFF aquí

      setTimeout(() => {
        navigate("/board");
        dispatch({ type: "SET_LOADING", payload: false });
      }, 800); //da tiempo al spinner de mostrarse
    },
    onError(error: Error) {
      dispatch({ type: "SET_LOADING", payload: false }); // 👈 spinner OFF en error
      console.error("Register failed:", error);
    },
  });

  return { registerMutation };
};
