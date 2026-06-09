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
    // 🔑 [TokenStore] Access Token inyectado en: ${config.url}
    console.debug(`🔑 [Auth] Token inyectado →`, config.url);
  } else {
    console.debug(`⚠️  [Auth] Sin token para →`, config.url);
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
      console.warn(`🔒 [Auth] 401 recibido en "${url}" — intentando refresh silencioso...`);

      // Si ya hay un refresh en vuelo, encola la petición
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          console.debug(`⏳ [Auth] Petición encolada (refresh en progreso):`, url);
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
        console.log(`🔄 [Auth] Solicitando nuevo Access Token → POST /auth/refresh`);
        const { data } = await api.post<{ accessToken: string }>(
          "/auth/refresh",
        );
        const newToken = data.accessToken;

        console.log(`✅ [Auth] Nuevo Access Token recibido. Reintentando petición original: "${url}"`);

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
        console.error(`❌ [Auth] Refresh fallido — cerrando sesión automáticamente.`);
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
