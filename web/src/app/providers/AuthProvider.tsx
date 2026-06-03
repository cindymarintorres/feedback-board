import { useReducer, useEffect } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "@/context/AuthContext";
import {
  AuthStateSchema,
  type AuthState,
  type AuthAction,
} from "@/context/schemas/auth.context.schema";
import { FullscreenSpinner } from "@/components/shared";

// ─── Estado inicial vacío ─────────────────────────
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
};

// ─── El guardia (reducer) ─────────────────────────
function authReducer(state: AuthState, action: AuthAction): AuthState {
  console.log("🔄 Action:", action.type, action); // 👈
  switch (action.type) {
    case "LOGIN":
      return {
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: true, //siempre false al terminar
      };
    case "LOGOUT":
      return {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    // Agrega acción SET_LOADING:
    case "SET_LOADING":
      console.log("⏳ SET_LOADING →", action.payload); // 👈
      return { ...state, isLoading: action.payload };

    case "UPDATE_USER":
      return {
        ...state,
        user: { ...state.user!, ...action.payload },
      };

    default:
      return state;
  }
}

// ─── El Provider ──────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState, () => {
    // Al arrancar revisa si había sesión guardada
    try {
      const token = localStorage.getItem("token");
      const rawUser = localStorage.getItem("user");

      if (!token || !rawUser) return initialState;

      // Zod valida que lo guardado en localStorage es confiable
      const parsed = AuthStateSchema.safeParse({
        token,
        user: JSON.parse(rawUser),
        isAuthenticated: true,
      });
      return parsed.success ? parsed.data : initialState;
    } catch {
      return initialState;
    }
  });

  // Sincroniza localStorage cuando cambia el estado
  useEffect(() => {
    if (state.token && state.user) {
      localStorage.setItem("token", state.token);
      localStorage.setItem("user", JSON.stringify(state.user));
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }, [state.token, state.user]);

  useEffect(() => {
    const handleUnauthorized = () => {
      dispatch({ type: "LOGOUT" });
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, []);

  console.log("🏠 AuthProvider render, isLoading:", state.isLoading); // 👈

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {state.isLoading && <FullscreenSpinner />}
      {children}
    </AuthContext.Provider>
  );
}
