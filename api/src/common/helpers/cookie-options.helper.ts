import { CookieOptions } from 'express';

export function getRefreshCookieOptions(): CookieOptions {
  const isProd = process.env.NODE_ENV === 'production';

  return {
    httpOnly: true,                           // siempre — JS nunca puede leerla
    secure: isProd,                           // true en prod (HTTPS), false en dev (HTTP)
    sameSite: isProd ? 'strict' : 'lax',     // strict en prod, lax en dev
    path: '/',                                // envía en todos los requests al origen
    maxAge: 7 * 24 * 60 * 60 * 1000,         // 7 días en ms
  };
}