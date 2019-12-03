import * as types from './te.actionTypes';

// INITIAL STATE
import { initialState } from './te.initialState';

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_TE_DATA_FOR_VALUES: {
      const { extIdProps } = action.payload;
      return {
        ...state,
        extIdProps,
      };
    }

    default:
      return state;
  }
};

export default reducer;
