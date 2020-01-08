export const API_URL =
  process.env.NODE_ENV === 'production' ? 'https://preferences.timeedit.io/v1/' : 'http://localhost:3002/v1/';
export const TOKEN_NAME = 'te_auth_token';
export default {};
