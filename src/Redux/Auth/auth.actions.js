import { TOKEN_NAME, getEnvParams } from '../../configs';
import { asyncAction } from '../../Utils/actionHelpers';
import { deleteToken } from '../../Utils/tokenHelpers';
import {
  FETCH_PROFILE_REQUEST,
  FETCH_PROFILE_SUCCESS,
  FETCH_PROFILE_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_MULTIPLE_ORGS,
  FETCH_ORGS_FOR_USER_REQUEST,
  FETCH_ORGS_FOR_USER_SUCCESS,
  FETCH_ORGS_FOR_USER_FAILURE,
  SELECT_ORG_FOR_USER_REQUEST,
  SELECT_ORG_FOR_USER_SUCCESS,
  SELECT_ORG_FOR_USER_FAILURE,
  GET_ORG_FOR_USER_REQUEST,
  GET_ORG_FOR_USER_SUCCESS,
  GET_ORG_FOR_USER_FAILURE,
  GET_INTEGRATION_SETTINGS_REQUEST,
  GET_INTEGRATION_SETTINGS_SUCCESS,
  GET_INTEGRATION_SETTINGS_FAILURE,
  LOGOUT,
  VALIDATE_LOGIN,
} from './auth.actionTypes';

const fetchProfileFlow = {
  request: () => ({ type: FETCH_PROFILE_REQUEST }),
  success: (response) => ({
    type: FETCH_PROFILE_SUCCESS,
    payload: { ...response },
  }),
  failure: (err) => ({ type: FETCH_PROFILE_FAILURE, payload: { ...err } }),
};

export const fetchProfile = () =>
  asyncAction.GET({
    flow: fetchProfileFlow,
    endpoint: 'users/profile',
    requiresAuth: true,
  });

const fetchOrgFlow = {
  request: () => ({ type: GET_ORG_FOR_USER_REQUEST }),
  success: (response) => ({
    type: GET_ORG_FOR_USER_SUCCESS,
    payload: { ...response },
  }),
  failure: (err) => ({ type: GET_ORG_FOR_USER_FAILURE, payload: { ...err } }),
};

export const fetchOrg = () =>
  asyncAction.GET({
    flow: fetchOrgFlow,
    endpoint: 'organization',
    requiresAuth: true,
  });

export const fetchIntegrationSettingsFlow = {
  request: () => ({ type: GET_INTEGRATION_SETTINGS_REQUEST }),
  success: (response) => ({
    type: GET_INTEGRATION_SETTINGS_SUCCESS,
    payload: { ...response },
  }),
  failure: (err) => ({
    type: GET_INTEGRATION_SETTINGS_FAILURE,
    payload: { ...err },
  }),
};

export const fetchIntegrationSettings = (organizationId) =>
  asyncAction.GET({
    flow: fetchIntegrationSettingsFlow,
    endpoint: `integration-service/connection-setting/${organizationId}`,
  });

export const validateLogin = () => async (dispatch) => {
  const token = await window.localStorage.getItem(TOKEN_NAME);
  if (token) {
    dispatch({ type: VALIDATE_LOGIN, payload: { token } });
  }
};

const loginFlow = {
  request: () => ({ type: LOGIN_REQUEST }),
  success: (response) => {
    if (!response.user) {
      return { type: LOGIN_FAILURE, payload: { ...response } };
    }
    if (!response.user.organizationId) {
      return { type: LOGIN_MULTIPLE_ORGS, payload: { ...response } };
    }

    return { type: LOGIN_SUCCESS, payload: { ...response } };
  },
  failure: (err) => ({ type: LOGIN_FAILURE, payload: { ...err } }),
};

export const login = ({ account, password }) =>
  asyncAction.POST({
    flow: loginFlow,
    endpoint: `${getEnvParams().AUTH_URL}auth/validate-login`,
    params: { account, password },
    requiresAuth: false,
  });

const fetchOrgsForUserFlow = {
  request: () => ({ type: FETCH_ORGS_FOR_USER_REQUEST }),
  success: (response) => ({
    type: FETCH_ORGS_FOR_USER_SUCCESS,
    payload: { ...response },
  }),
  failure: (err) => ({
    type: FETCH_ORGS_FOR_USER_FAILURE,
    payload: { ...err },
  }),
};

export const fetchOrgsForUser = () =>
  asyncAction.GET({
    flow: fetchOrgsForUserFlow,
    endpoint: `${getEnvParams().AUTH_URL}apps/${
      getEnvParams().APP_ID
    }/organizations/`,
  });

const selectOrgForUserFlow = {
  request: () => ({ type: SELECT_ORG_FOR_USER_REQUEST }),
  success: (response) => ({
    type: SELECT_ORG_FOR_USER_SUCCESS,
    payload: { ...response },
  }),
  failure: (err) => ({
    type: SELECT_ORG_FOR_USER_FAILURE,
    payload: { ...err },
  }),
};

export const selectOrgForUser = ({ organizationId, app }) =>
  asyncAction.POST({
    flow: selectOrgForUserFlow,
    endpoint: `${getEnvParams().AUTH_URL}auth/change-organization`,
    params: { organizationId, app },
  });

export const logout = () => async (dispatch) => {
  await deleteToken();
  dispatch({ type: LOGOUT });
};
