/**
 * Token Store — puente en memoria entre el AuthProvider y Axios.
 *
 * El Access Token vive aquí (RAM), NO en localStorage.
 * Axios lo lee desde aquí para no depender del contexto de React.
 */
let _accessToken: string | null = null;

export const tokenStore = {
  get: () => _accessToken,
  set: (token: string | null) => { _accessToken = token; },
  clear: () => { _accessToken = null; },
};
