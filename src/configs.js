const envVarMap = {
  production: {
    API_URL: 'https://preferences.timeedit.com/v1/',
    AUTH_URL: 'https://auth.timeedit.com/v1/',
    APP_ID: '5d08ae441dcbc63d30dd3e44',
  },
  development: {
    API_URL: 'https://preferences.timeedit.io/v1/',
    AUTH_URL: 'https://auth.timeedit.io/v1/',
    APP_ID: '5ce6501aa34e8a7737977c2a',
  },
  localhost: {
    API_URL: 'http://localhost:3002/v1/',
    AUTH_URL: 'https://auth.timeedit.io/v1/',
    APP_ID: '5ce6501aa34e8a7737977c2a',
  },
};

const availableEnvs = [
  'production',
  'development',
  'localhost',
];

export const getEnvParams = () => {
  const storeState = window.tePrefsLibStore.getState();
  const env = storeState.auth.env || 'production';
  if (!env || !availableEnvs.includes(env)) return envVarMap.production;
  return envVarMap[env];
};

export const TOKEN_NAME = 'te_auth_token';
