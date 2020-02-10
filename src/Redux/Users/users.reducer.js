import * as types from './users.actionTypes';
import { User } from '../../Models/User.model';

// INITIAL STATE
import initialState from './users.initialState';

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_USER_SUCCESS:
      const user = new User(action.payload);
      return {
        ...state,
        [user._id]: user,
      };

    default:
      return state;
  }
}

export default reducer;
