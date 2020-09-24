import { asyncAction } from '../../Utils/actionHelpers';
import * as types from './users.actionTypes';
import { getEnvParams } from '../../configs';

const fetchUserFlow = {
  request: () => ({ type: types.FETCH_USER_REQUEST }),
  success: response => ({ type: types.FETCH_USER_SUCCESS, payload: { ...response } }),
  failure: err => ({ type: types.FETCH_USER_FAILURE, payload: { ...err } }),
};

export const fetchUser = (organizationId, userId) =>
  asyncAction.GET({
    flow: fetchUserFlow,
    endpoint: `${getEnvParams().ADMIN_URL}organizations/${organizationId}/users/${userId}`,
  });

const fetchUsersFlow = {
  request: () => ({ type: types.FETCH_USERS_REQUEST }),
  success: response => ({ type: types.FETCH_USERS_SUCCESS, payload: { ...response } }),
  failure: err => ({ type: types.FETCH_USERS_FAILURE, payload: { ...err } }),
};

export const fetchUsers = organizationId =>
  asyncAction.GET({
    flow: fetchUsersFlow,
    endpoint: `${getEnvParams().ADMIN_URL}organizations/${organizationId}/users`,
  });
