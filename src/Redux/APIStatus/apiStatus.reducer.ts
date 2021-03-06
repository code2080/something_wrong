/* eslint no-nested-ternary: "off" */

import _ from 'lodash';
import { combineReducers } from 'redux';
import { initialState } from './apiStatus.initialState';

const loading = (state = initialState.loading, action) => {
  const { type } = action;
  const matches = /(.*)_(REQUEST|SUCCESS|FAILURE)/.exec(type);

  // not a *_REQUEST / *_SUCCESS /  *_FAILURE actions, so we ignore them
  if (!matches) return state;

  const [, requestName, requestState] = matches;
  return {
    ...state,
    // Store whether a request is happening at the moment or not
    // e.g. will be true when receiving GET_TODOS_REQUEST
    //      and false when receiving GET_TODOS_SUCCESS / GET_TODOS_FAILURE
    [requestName]: requestState === 'REQUEST',
  };
};

const error = (state = initialState.error, action) => {
  const { type, payload } = action;
  const matches = /(.*)_(REQUEST|FAILURE)/.exec(type);
  // not a *_REQUEST / *_FAILURE actions, so we ignore them
  if (!matches || !payload) return state;
  const [, requestName, requestState] = matches;

  return {
    ...state,
    // Store errorMessage
    // e.g. stores errorMessage when receiving GET_TODOS_FAILURE
    //      else clear errorMessage when receiving GET_TODOS_REQUEST
    [requestName]:
      requestState === 'FAILURE'
        ? action.payload
          ? _.get(
              action.payload,
              'code',
              _.get(action, 'meta.responseBody.code', 'error'),
            )
          : 'error'
        : '',
  };
};

export const apiStatus = combineReducers({
  loading,
  error,
});
