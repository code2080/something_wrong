import { TOKEN_NAME } from '../../configs';
import { asyncAction } from '../../Utils/actionHelpers';
import { deleteToken } from '../../Utils/tokenHelpers';
import {
  VALIDATE_LOGIN,
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
  LOGOUT
} from './auth.actionTypes';

export const validateLogin = () => async dispatch => {
  const token = await window.localStorage.getItem(TOKEN_NAME);
  if (token)
    dispatch({ type: VALIDATE_LOGIN, payload: { token } });
};

const loginFlow = {
  request: () => ({ type: LOGIN_REQUEST }),
  success: response => {
    if (!response.user)
      return ({ type: LOGIN_FAILURE, payload: { ...response } });
    if (!response.user.organizationId)
      return ({ type: LOGIN_MULTIPLE_ORGS, payload: { ...response } });

    return { type: LOGIN_SUCCESS, payload: { ...response } }
  },
  failure: err => ({ type: LOGIN_FAILURE, payload: { ...err } }),
};

export const login = ({ account, password }) =>
  asyncAction.POST({
    flow: loginFlow,
    endpoint: 'https://auth.timeedit.io/v1/auth/validate-login',
    params: { account, password, },
    requiresAuth: false,
  });

const fetchOrgsForUserFlow = {
  request: () => ({ type: FETCH_ORGS_FOR_USER_REQUEST }),
  success: response => ({ type: FETCH_ORGS_FOR_USER_SUCCESS, payload: { ...response } }),
  failure: err => ({ type: FETCH_ORGS_FOR_USER_FAILURE, payload: { ...err } }),
};

export const fetchOrgsForUser = () =>
  asyncAction.GET({
    flow: fetchOrgsForUserFlow,
    endpoint: 'https://auth.timeedit.io/v1/apps/5ce6501aa34e8a7737977c2a/organizations/',
    requiresAuth: true,
  });

const selectOrgForUserFlow = {
  request: () => ({ type: SELECT_ORG_FOR_USER_REQUEST }),
  success: response => ({ type: SELECT_ORG_FOR_USER_SUCCESS, payload: { ...response } }),
  failure: err => ({ type: SELECT_ORG_FOR_USER_FAILURE, payload: { ...err } }),
};

export const selectOrgForUser = ({ organizationId }) =>
  asyncAction.POST({
    flow: selectOrgForUserFlow,
    endpoint: 'https://auth.timeedit.io/v1/auth/change-organization',
    params: { organizationId },
    requiresAuth: true,
  });

export const logout = () => async dispatch => {
  await deleteToken();
  dispatch({ type: LOGOUT });
};
