import { TOKEN_NAME, AUTH_URL, APP_ID } from '../../configs';
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
  LOGOUT
} from './auth.actionTypes';

const fetchUserFlow = {
  request: () => ({ type: FETCH_PROFILE_REQUEST }),
  success: response => ({ type: FETCH_PROFILE_SUCCESS, payload: { ...response } }),
  failure: err => ({ type: FETCH_PROFILE_FAILURE, payload: { ...err } }),
};

const fetchUser = () => asyncAction.GET({
  flow: fetchUserFlow,
  endpoint: 'users/profile',
  requiresAuth: true,
});

export const validateLogin = () => async dispatch => {
  const token = await window.localStorage.getItem(TOKEN_NAME);
  if (token)
    dispatch(fetchUser());
};

const loginFlow = {
  request: () => ({ type: LOGIN_REQUEST }),
  success: response => {
    console.log(response);
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
    endpoint: `${AUTH_URL}auth/validate-login`,
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
    endpoint: `${AUTH_URL}apps/${APP_ID}/organizations/`,
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
    endpoint: `${AUTH_URL}auth/change-organization`,
    params: { organizationId },
    requiresAuth: true,
  });

export const logout = () => async dispatch => {
  await deleteToken();
  dispatch({ type: LOGOUT });
};
