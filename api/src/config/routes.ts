export const ROUTES = {
  auth: {
    resetPassword: '/reset-password',
    login: '/login',
  },

  commerces: {
    bySlug: '/commerce/slug/:slug',
    verifyCommerce: '/commerce/verify'
  },
  feedback: '/feedback',
} as const;
