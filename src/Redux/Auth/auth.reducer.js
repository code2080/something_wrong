import * as types from './auth.actionTypes';
import { setToken } from '../../Utils/tokenHelpers';

// INITIAL STATE
import initialState from './Auth.initialState';

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.VALIDATE_LOGIN:
      if (!action || !action.payload || !action.payload.token)
        return state;
      return {
        ...state,
        isLoggedIn: true,
      };

    case types.LOGIN_SUCCESS: {
      // If payload doesn't contain token
      if (!action || !action.payload || !action.payload.token || !action.payload.token.accessToken)
        return {
          ...state,
          isLoggedIn: false,
        };

      const { payload: { token: { accessToken } } } = action;
      setToken(accessToken);
      return {
        ...state,
        isLoggedIn: true,
      };
    };

    case types.LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
      };

    case types.LOGIN_FAILURE:
      setToken(null);
      return {
        ...state,
        isLoggedIn: false,
      };

    default:
      return state;
  }
}

export default reducer;
