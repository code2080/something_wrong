import { TOKEN_NAME } from '../configs';

export const getToken = async () => window.localStorage.getItem(TOKEN_NAME);

export const setToken = async accessToken => window.localStorage.setItem(TOKEN_NAME, accessToken);

export const deleteToken = async () => window.localStorage.removeItem(TOKEN_NAME);
