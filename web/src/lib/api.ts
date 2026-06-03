import axios from "axios";

export const api = axios.create({
  baseURL: "/api", // usa el proxy de Vite — no hardcodear la URL
});

// Request interceptor — agrega el token en cada request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor — maneja 401 globalmente SIN recargar la página
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;

    const isLoginRequest = url?.includes("/auth/login");
    const isPasswordUpdate = url?.includes("/password");

    if (status === 401 && !isLoginRequest && !isPasswordUpdate) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Avisamos a React que la sesión expiró
      window.dispatchEvent(new Event("auth:unauthorized"));
    }

    return Promise.reject(error);
  },
);
