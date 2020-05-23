import { asyncAction } from '../../Utils/actionHelpers';
import * as types from './users.actionTypes';

const fetchUserFlow = {
  request: () => ({ type: types.FETCH_USER_REQUEST }),
  success: response => ({ type: types.FETCH_USER_SUCCESS, payload: { ...response } }),
  failure: err => ({ type: types.FETCH_USER_FAILURE, payload: { ...err } }),
};

export const fetchUser = userId =>
  asyncAction.GET({
    flow: fetchUserFlow,
    endpoint: `users/${userId}`,
  });

const fetchUsersFlow = {
  request: () => ({ type: types.FETCH_USERS_REQUEST }),
  success: response => ({ type: types.FETCH_USERS_SUCCESS, payload: { ...response } }),
  failure: err => ({ type: types.FETCH_USERS_FAILURE, payload: { ...err } }),
};

export const fetchUsers = () =>
  asyncAction.GET({
    flow: fetchUsersFlow,
    endpoint: `users`,
  });
