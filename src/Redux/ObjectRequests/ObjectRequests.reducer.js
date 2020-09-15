import _ from 'lodash';
import * as types from './ObjectRequests.actionTypes';
import { initialState } from './ObjectRequests.initialState';

export default (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_OBJECT_REQUESTS_SUCCESS: {
      return {
        ...state,
        list: action.payload.requests,
      };
    }

    case types.SET_OBJECT_REQUEST:
      return {
        ...state,
        objectRequest: action.payload.objectRequest,
      };

    default:
      return { ...state };
  }
};
