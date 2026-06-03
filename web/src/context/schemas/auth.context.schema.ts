import { z } from "zod";
import { PublicUserSchema, type PublicUser } from "feedbackboard-shared";

export const AuthStateSchema = z.object({
  user: PublicUserSchema.nullable(),
  token: z.string().nullable(),
  isAuthenticated: z.boolean(),
  isLoading: z.boolean().default(false), //Optional
});

export type AuthState = z.infer<typeof AuthStateSchema>;

type LoginPayload = {
  user: NonNullable<AuthState["user"]>;
  token: NonNullable<AuthState["token"]>;
};

export type AuthAction =
  | { type: "LOGIN"; payload: LoginPayload }
  | { type: "LOGOUT" }
  | { type: "SET_LOADING"; payload: AuthState["isLoading"] }
  | { type: "UPDATE_USER"; payload: Partial<PublicUser> };
