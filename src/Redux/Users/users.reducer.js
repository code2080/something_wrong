import _ from 'lodash';
import { FETCH_FORMS_SUCCESS } from '../DEPR_Forms/forms.actionTypes';
import { FETCH_PROFILE_SUCCESS } from '../Auth/auth.actionTypes';
import { User } from '../../Models/User.model';
import * as types from './users.actionTypes';

// INITIAL STATE
import initialState from './users.initialState';

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PROFILE_SUCCESS: {
      const userObj = {
        _id: action.payload.id,
        ...action.payload,
      };
      const user = new User(userObj);
      return {
        ...state,
        [user._id]: user,
      };
    }

    case types.FETCH_USER_SUCCESS: {
      const user = new User(action.payload);
      return {
        ...state,
        [user._id]: user,
      };
    }
    case types.FETCH_USERS_SUCCESS:
      return _.chain(action.payload.users)
        .map((u) => new User(u))
        .keyBy('_id')
        .valueOf();

    case FETCH_FORMS_SUCCESS:
      return (action.payload.owners || []).reduce(
        (s, o) => ({
          [o._id]: new User(o),
          ...s, // Intentionally overwriting value if it already is in state (always more information available on the object already in state)
        }),
        state,
      );

    default:
      return state;
  }
};

export default reducer;
