export const API_URL =
  process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:3002/v1/'; // 'https://preferences.timeedit.io/v1/';
export const TOKEN_NAME = 'te_auth_token';
export default {};
