/**
 * Route metadata and configuration for Tunease Auth Service
 */
export const AUTH_ROUTES = {
  HOME: {
    path: '/',
    name: 'Home',
    description: 'Default entry route that displays Login or redirects to Profile if authenticated',
    requiresAuth: false,
  },
  LOGIN: {
    path: '/login',
    name: 'Sign In',
    description: 'Email/Password and Google OAuth authentication portal',
    requiresAuth: false,
  },
  REGISTER: {
    path: '/register',
    name: 'Register',
    description: 'New account onboarding for listeners and creators',
    requiresAuth: false,
  },
  PROFILE: {
    path: '/profile',
    name: 'User Profile',
    description: 'Account overview, personal credentials and profile settings',
    requiresAuth: true,
  },
  ME: {
    path: '/me',
    name: 'Current Session Profile',
    description: 'Direct alias for User Profile route',
    requiresAuth: true,
  },
};

export const ROUTES_LIST = Object.values(AUTH_ROUTES);
