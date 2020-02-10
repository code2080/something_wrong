import { asyncAction } from '../../Utils/actionHelpers';
import {
  FETCH_USER_REQUEST,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAILURE,
} from './users.actionTypes';

const fetchUserFlow = {
  request: () => ({ type: FETCH_USER_REQUEST }),
  success: response => ({ type: FETCH_USER_SUCCESS, payload: { ...response } }),
  failure: err => ({ type: FETCH_USER_FAILURE, payload: { ...err } }),
};

export const fetchUser = userId =>
  asyncAction.GET({
    flow: fetchUserFlow,
    endpoint: `users/${userId}`,
  });
