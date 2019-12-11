import * as types from './integration.actionTypes';

// INITIAL STATE
import initialState from './integration.initialState';

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_INTEGRATION_SETTINGS_SUCCESS:
      console.log(action);
      return state;

    default:
      return state;
  }
}

export default reducer;
