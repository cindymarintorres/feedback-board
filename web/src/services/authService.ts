import { api } from "@/lib/api";
import {
  LoginResponseSchema, // parsea lo que devuelve la API en login
  PublicUserSchema, // parsea lo que devuelve la API en register/me
  type LoginResponse, // tipo del token que devuelve login
  type PublicUser, // tipo del usuario que devuelve la API
  type LoginDto, // tipo del payload de login (email + password)
  type RegisterDto,
  type ForgotPasswordDto,
  type ResetPasswordDto, // tipo del payload de register (sin confirmPassword)
  type RegisterCommerceDto,
  CommerceVerificationResponseSchema
} from "feedbackboard-shared";
import {
  LoginSchema,
  RegisterPayloadSchema,
} from "@/features/auth/schemas/auth.schema";
import { RegisterCommercePayloadSchema } from "@/features/commerces/schemas/commerce.schema";

export const authService = {
  // Recibe LoginDto (email+password), devuelve el token
  login: async (payload: LoginDto): Promise<LoginResponse> => {
    const safePayload = LoginSchema.parse(payload); // valida antes de enviar
    const { data } = await api.post("/auth/login", safePayload);
    return LoginResponseSchema.parse(data); // valida lo que devuelve la API
  },

  // Recibe RegisterDto (name+email+password), devuelve el usuario creado
  register: async (payload: RegisterDto): Promise<PublicUser> => {
    const safePayload = RegisterPayloadSchema.parse(payload); // omite confirmPassword
    const { data } = await api.post("/auth/register", safePayload);
    return PublicUserSchema.parse(data);
  },

  // No recibe nada, devuelve el usuario autenticado actual
  userAuth: async (): Promise<PublicUser> => {
    const { data } = await api.get("/auth/user");
    return PublicUserSchema.parse(data);
  },

  forgotPassword: async (
    payload: ForgotPasswordDto,
  ): Promise<{ message: string }> => {
    const { data } = await api.post("/auth/forgot-password", payload);
    return data;
  },

  resetPassword: async (
    payload: ResetPasswordDto,
  ): Promise<{ message: string }> => {
    const { data } = await api.post("/auth/reset-password", payload);
    return data;
  },

  validateResetToken: async (token: string): Promise<{ valid: boolean }> => {
    const { data } = await api.get(`/auth/validate-token?token=${token}`);
    return data;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout", null, {
      withCredentials: true, // envía la httpOnly cookie
    });
  },

  refresh: async (): Promise<LoginResponse> => {
    const { data } = await api.post("/auth/refresh", null, {
      withCredentials: true, // envía la refresh cookie
    });
    return LoginResponseSchema.parse(data);
  },

  registerCommerce: async (payload: RegisterCommerceDto): Promise<LoginResponse> => {
    const safePayload = RegisterCommercePayloadSchema.parse(payload);
    const { data } = await api.post("/auth/register-commerce", safePayload);
    return LoginResponseSchema.parse(data); // mismo shape que login: { accessToken, user }
  },

  verifyCommerce: async (token: string): Promise<{ message: string }> => {
    const { data } = await api.get(`/auth/verify-commerce?token=${token}`);
    return CommerceVerificationResponseSchema.parse(data);
  },
};
