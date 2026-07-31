import { isAxiosError } from "axios";

/**
 * Extrae un mensaje de error seguro para mostrar al usuario.
 *
 * Solo confía en el `message` que devuelve el backend cuando el status
 * es 4xx (errores de validación/negocio esperados, ej. 409 review duplicada).
 * Para 5xx, errores de red, o cualquier otro caso, devuelve el `fallback`
 * para no exponer detalles internos (stack traces, errores de infraestructura, etc.).
 *
 * @param error - El error capturado en el onError de una mutation (unknown)
 * @param fallback - Mensaje genérico a mostrar si no hay un mensaje seguro del backend
 */
export function getErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError<{ message?: string }>(error)) {
    const status = error.response?.status;
    const isClientError = typeof status === "number" && status >= 400 && status < 500;

    if (isClientError && error.response?.data?.message) {
      return error.response.data.message;
    }
  }

  return fallback;
}