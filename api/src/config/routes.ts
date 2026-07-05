export const ROUTES = {
  auth: {
    resetPassword: '/reset-password',
    login: '/login',
  },

  commerces: {
    bySlug: '/commerces/slug/:slug',
    verifyCommerce: '/commerces/verify'
  },
  feedback: '/feedback',
} as const;
