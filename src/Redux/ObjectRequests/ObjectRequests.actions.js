import * as types from './ObjectRequests.actionTypes';
import { asyncAction } from '../../Utils/actionHelpers';

export const setObjectRequest = objectRequest => ({
  type: types.SET_OBJECT_REQUEST,
  payload: {
    objectRequest,
  },
});

export const resetObjectRequest = () => ({
  type: types.SET_OBJECT_REQUEST,
  payload: {
    objectRequest: null,
  },
});

const fetchObjectRequestsFlow = {
  request: () => ({ type: types.FETCH_OBJECT_REQUESTS_REQUEST }),
  success: response => ({ type: types.FETCH_OBJECT_REQUESTS_SUCCESS, payload: response }),
  failure: err => ({ type: types.FETCH_OBJECT_REQUESTS_FAILURE, ...err }),
};
export const fetchObjectRequests = () => 
  asyncAction.GET({
    flow: fetchObjectRequestsFlow,
    endpoint: 'object-request'
  });

const updateObjectRequestFlow = {
  request: () => ({ type: types.UPDATE_OBJECT_REQUEST_REQUEST }),
  success: response => ({ type: types.UPDATE_OBJECT_REQUEST_SUCCESS, payload: response }),
  failure: err => ({ type: types.UPDATE_OBJECT_REQUEST_FAILURE, ...err }),
};
export const updateObjectRequest = objectRequest =>
  asyncAction.PUT({
    flow: updateObjectRequestFlow,
    endpoint: `object-request/${encodeURIComponent(objectRequest._id)}`,
    params: {
      ...objectRequest,
    },
  });

