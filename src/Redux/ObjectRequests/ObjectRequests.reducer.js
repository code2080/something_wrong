import ObjectRequest from '../../Models/ObjectRequest.model';
import * as types from './ObjectRequests.actionTypes';
import { initialState } from './ObjectRequests.initialState';

// MODELS

export default (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_OBJECT_REQUESTS_SUCCESS: {
      return {
        ...state,
        list: action.payload.requests.reduce(
          (reqs, req) => [...reqs, new ObjectRequest(req)],
          [],
        ),
      };
    }

    case types.UPDATE_OBJECT_REQUEST_SUCCESS: {
      const { request } = action.payload;
      return {
        ...state,
        list: state.list.map((req) =>
          req._id === request._id ? request : req,
        ),
      };
    }

    case types.SET_OBJECT_REQUEST:
      return {
        ...state,
        objectRequest: action.payload.objectRequest,
      };

    default:
      return state;
  }
};
