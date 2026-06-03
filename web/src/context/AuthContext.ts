import { createContext } from "react";
import type { AuthState, AuthAction } from "./schemas/auth.context.schema";

// ─── El contexto (la pizarra) ─────────────────────
export const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
} | null>(null);
