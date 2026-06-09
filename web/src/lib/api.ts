import axios from "axios";
import type { AxiosRequestConfig } from "axios";
import { tokenStore } from "./tokenStore";

export const api = axios.create({
  baseURL: "/api", // usa el proxy de Vite — no hardcodear la URL
  withCredentials: true, // envía siempre la cookie HTTPOnly del refreshToken
});

// ─── Request interceptor ──────────────────────────────────────────────────────
// Lee el Access Token desde memoria (tokenStore) y lo inyecta en cada petición.
api.interceptors.request.use((config) => {
  const token = tokenStore.get();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ─── Response interceptor ─────────────────────────────────────────────────────
// Si recibe un 401, intenta renovar el Access Token silenciosamente.
// Solo desloguea si el propio refresh también falla.

let isRefreshing = false;
let pendingQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processPendingQueue(error: unknown, token: string | null) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (token) {
      resolve(token);
    } else {
      reject(error);
    }
  });
  pendingQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };
    const status = error.response?.status;
    const url = originalRequest?.url ?? "";

    // Rutas que NO deben intentar refresh aunque reciban 401
    const isAuthRoute =
      url.includes("/auth/login") ||
      url.includes("/auth/register") ||
      url.includes("/auth/refresh") ||
      url.includes("/auth/forgot-password") ||
      url.includes("/auth/reset-password");

    if (status === 401 && !isAuthRoute && !originalRequest._retry) {
      // Si ya hay un refresh en vuelo, encola la petición
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        }).then((newToken) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          return api(originalRequest);
        });
      }

      // Primer 401: disparar el refresh
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await api.post<{ accessToken: string }>(
          "/auth/refresh",
        );
        const newToken = data.accessToken;

        // Guarda el nuevo token en memoria
        tokenStore.set(newToken);

        // Desbloquea las peticiones que estaban esperando
        processPendingQueue(null, newToken);

        // Reintenta la petición original con el token nuevo
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        // El refresh también falló → sesión expirada de verdad
        processPendingQueue(refreshError, null);
        tokenStore.clear();
        window.dispatchEvent(new Event("auth:unauthorized"));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
