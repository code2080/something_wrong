import { TOKEN_NAME } from '../../configs';
import { asyncAction } from '../../Utils/actionHelpers';
import { deleteToken } from '../../Utils/tokenHelpers';
import {
  VALIDATE_LOGIN,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT
} from './auth.actionTypes';

export const validateLogin = () => async dispatch => {
  const token = await window.localStorage.getItem(TOKEN_NAME);
  if (token)
    dispatch({ type: VALIDATE_LOGIN, payload: { token } });
};

const loginFlow = {
  request: () => ({ type: LOGIN_REQUEST }),
  success: response => ({ type: LOGIN_SUCCESS, payload: { ...response } }),
  failure: err => ({ type: LOGIN_FAILURE, payload: { ...err } }),
};

export const login = ({ account, password }) =>
  asyncAction.POST({
    flow: loginFlow,
    endpoint: 'https://auth.timeedit.io/v1/auth/validate-login',
    params: { account, password, },
    requiresAuth: false,
  });

export const logout = () => async dispatch => {
  await deleteToken();
  dispatch({ type: LOGOUT });
};
