export const ROUTES = {
  auth: {
    resetPassword: '/reset-password',
    login: '/login',
  },

  commerces: {
    bySlug: '/commerces/slug/:slug',
  },
  feedback: '/feedback',
} as const;
