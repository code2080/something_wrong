const apiVersion = 'v1';

const envVarMap = {
  production: {
    API_URL: `https://preferences.timeedit.com/${apiVersion}/`,
    AUTH_URL: `https://auth.timeedit.com/${apiVersion}/`,
    ADMIN_URL: `https://admin.timeedit.com/${apiVersion}/`,
    APP_ID: '5d08ae441dcbc63d30dd3e44',
    APP_NAME: 'tePIC',
    VIEWS_URL: `https://views.timeedit.com/${apiVersion}/`
  },
  staging: {
    API_URL: `https://preferences.timeedit.io/${apiVersion}/`,
    AUTH_URL: `https://auth.timeedit.io/${apiVersion}/`,
    ADMIN_URL: `https://admin.timeedit.io/${apiVersion}/`,
    APP_ID: '5ce6501aa34e8a7737977c2a',
    APP_NAME: 'tePIC',
    VIEWS_URL: `https://views.timeedit.io/${apiVersion}/`
  },
  beta: {
    API_URL: `http://preferences-beta.timeedit.io/${apiVersion}/`,
    AUTH_URL: `http://auth-beta.timeedit.io/${apiVersion}/`,
    ADMIN_URL: `http://admin-beta.timeedit.io/${apiVersion}/`,
    APP_ID: '5e35700bdb7664942c406b9d ',
    APP_NAME: 'tePIC',
    VIEWS_URL: `http://views-beta.timeedit.io/${apiVersion}/`,
    AE_OL_URL: `http://34.120.138.176/${apiVersion}/`,
  },
  localhost: {
    API_URL: `http://localhost:3002/${apiVersion}/`,
    AUTH_URL: `https://auth.timeedit.io/${apiVersion}/`,
    ADMIN_URL: `https://admin.timeedit.io/${apiVersion}/`,
    APP_ID: '5ce6501aa34e8a7737977c2a',
    APP_NAME: 'tePIC',
    VIEWS_URL: `https://views.timeedit.io/${apiVersion}/`
  },
};

const availableEnvs = [
  'production',
  'staging',
  'beta',
  'localhost',
];

export const getEnvParams = () => {
  const storeState = window.tePrefsLibStore.getState();
  const env = storeState.auth.env || 'production';
  if (!env || !availableEnvs.includes(env)) return envVarMap.production;
  return envVarMap[env];
};

export const TOKEN_NAME = 'te_auth_token';
