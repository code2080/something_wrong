const apiVersion = 'v1';

const envVarMap = {
  production: {
    API_URL: `https://preferences.timeedit.com/${apiVersion}/`,
    AUTH_URL: `https://auth.timeedit.com/${apiVersion}/`,
    ADMIN_URL: `https://admin.timeedit.com/${apiVersion}/`,
    APP_ID: '5d08ae441dcbc63d30dd3e44',
    APP_NAME: 'tePIC',
    VIEWS_URL: `https://views.timeedit.com/${apiVersion}/`,
    AE_OL_URL: `https://activity-manager.timeedit.com/${apiVersion}/`,
    // AE_OL_URL: `http://localhost:3000/${apiVersion}/`,
  },
  staging: {
    API_URL: `https://preferences.timeedit.io/${apiVersion}/`,
    AUTH_URL: `https://auth.timeedit.io/${apiVersion}/`,
    ADMIN_URL: `https://admin.timeedit.io/${apiVersion}/`,
    APP_ID: '5ce6501aa34e8a7737977c2a',
    APP_NAME: 'tePIC',
    VIEWS_URL: `https://views.timeedit.io/${apiVersion}/`,
    AE_OL_URL: `https://activity-manager.timeedit.io/${apiVersion}/`,
  },
  beta: {
    API_URL: `https://preferences-beta.timeedit.io/${apiVersion}/`,
    AUTH_URL: `https://auth-beta.timeedit.io/${apiVersion}/`,
    ADMIN_URL: `https://admin-beta.timeedit.io/${apiVersion}/`,
    APP_ID: '5ce6501aa34e8a7737977c2a',
    APP_NAME: 'tePIC',
    VIEWS_URL: `https://views-beta.timeedit.io/${apiVersion}/`,
    AE_OL_URL: `https://beta-activity-manager.timeedit.io/${apiVersion}/`,
  },
  localhost: {
    API_URL: `http://localhost:3002/${apiVersion}/`,
    AUTH_URL: `https://auth.timeedit.io/${apiVersion}/`,
    ADMIN_URL: `https://admin.timeedit.io/${apiVersion}/`,
    APP_ID: '5ce6501aa34e8a7737977c2a',
    APP_NAME: 'tePIC',
    VIEWS_URL: `https://views.timeedit.io/${apiVersion}/`,
    AE_OL_URL: `http://localhost:3000/${apiVersion}/`,
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
