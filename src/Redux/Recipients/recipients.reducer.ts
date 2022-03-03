import { keyBy } from 'lodash';
import * as types from './recipients.actionTypes';

const initialState = {
  map: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_RECIPIENTS_SUCCESS: {
      return {
        ...state,
        map: {
          ...state.map,
          ...keyBy(action.payload.recipients, '_id'),
        },
      };
    }
    default:
      return state;
  }
};
