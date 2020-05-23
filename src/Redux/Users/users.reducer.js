import * as types from './users.actionTypes';
import { FETCH_PROFILE_SUCCESS } from '../Auth/auth.actionTypes';
import { User } from '../../Models/User.model';

// INITIAL STATE
import initialState from './users.initialState';

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PROFILE_SUCCESS: {
      const userObj = {
        _id: action.payload.id,
        ...action.payload
      };
      const user = new User(userObj);
      return {
        ...state,
        [user._id]: user,
      };
    }

    case types.FETCH_USER_SUCCESS:
      const user = new User(action.payload);
      return {
        ...state,
        [user._id]: user,
      };

    case types.FETCH_USERS_SUCCESS:
      return (action.payload.users || []).reduce((s, u) => ({
        ...s,
        [u._id]: new User(u),
      }), state);

    default:
      return state;
  }
}

export default reducer;
