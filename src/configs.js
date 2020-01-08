export const API_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://preferences.timeedit.com/v1/'
    : 'https://preferences.timeedit.com/v1/';

export const AUTH_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://auth.timeedit.io/v1/'
    : 'https://auth.timeedit.com/v1/';

export const APP_ID =
  process.env.NODE_ENV === 'production'
    ? '5ce6501aa34e8a7737977c2a'
    : '5d08ae441dcbc63d30dd3e44';

export const TOKEN_NAME = 'te_auth_token';
export default {};
