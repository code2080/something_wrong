import { TOKEN_NAME } from '../configs';

export const getToken = async () => window.localStorage.getItem(TOKEN_NAME);

export const setToken = async accessToken => window.localStorage.setItem(TOKEN_NAME, accessToken);
