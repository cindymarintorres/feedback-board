import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { authService } from "@/services/authService";
import { useAuth } from "@/hooks/useAuth";
import type { AddCommerceResponseDto, CreateOwnCommerceDto, LoginResponse, RegisterCommerceDto } from "feedbackboard-shared";
import { commerceService } from "@/services/comerceService";

export const useCommerceActions = (token?: string) => {
  const navigate = useNavigate();
  const { state, dispatch } = useAuth();

  const registerCommerceMutation = useMutation<RegisterCommerceDto>({
    mutationFn: (payload: RegisterCommerceDto) =>
      authService.registerCommerce(payload),
    onSuccess: (data: LoginResponse) => {
      dispatch({ type: "SET_LOADING", payload: true });

      dispatch({
        type: "LOGIN",
        payload: { user: data.user, token: data.accessToken },
      });

      setTimeout(() => {
        navigate("/board");
        dispatch({ type: "SET_LOADING", payload: false });
      }, 800);
    },
    onError(error: Error) {
      dispatch({ type: "SET_LOADING", payload: false });
      console.error("Register commerce failed:", error);
    },
  });

  const verifyCommerceQuery = useQuery({
    queryKey: ["verify-commerce", token],
    queryFn: () => authService.verifyCommerce(token!),
    enabled: !!token,
    retry: false,
    staleTime: 0,
  });

  const addCommerceMutation = useMutation({
    mutationFn: (payload: CreateOwnCommerceDto) => commerceService.addCommerce(payload),
    onSuccess: (newCommerce: AddCommerceResponseDto) => {
      if (!state.user) return;
      dispatch({
        type: "UPDATE_USER",
        payload: { commerce: [...state.user.commerce, newCommerce] },
      });
    },
  });

  return { registerCommerceMutation, verifyCommerceQuery , addCommerceMutation};
};
