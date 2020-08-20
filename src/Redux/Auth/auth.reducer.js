import * as types from './auth.actionTypes';
import { setToken } from '../../Utils/tokenHelpers';
import { authenticationStatuses } from '../../Constants/auth.constants';
import { actionsToSignOutOnFailure } from './auth.constants';

// INITIAL STATE
import initialState from './auth.initialState';

const reducer = (state = initialState, action) => {
  if (actionsToSignOutOnFailure.indexOf(action.type) > -1) {
    return initialState;
  }

  switch (action.type) {
    case types.SET_ENVIRONMENT: {
      const { env } = action.payload;
      return {
        ...state,
        env,
      };
    }

    case types.VALIDATE_LOGIN:
      if (!action || !action.payload || !action.payload.token)
        return initialState;
      return {
        ...state,
        authenticationStatus: authenticationStatuses.AUTHENTICATED,
      };

    case types.LOGIN_SUCCESS: {
      // If payload doesn't contain token
      if (!action || !action.payload || !action.payload.token || !action.payload.token.accessToken)
        return initialState;

      const { payload: { token: { accessToken } } } = action;
      setToken(accessToken);
      return {
        ...state,
        authenticationStatus: authenticationStatuses.AUTHENTICATED,
      };
    };

    case types.FETCH_PROFILE_SUCCESS:
      return {
        ...state,
        authenticationStatus: authenticationStatuses.AUTHENTICATED,
        user: action.payload,
      };

    case types.LOGIN_MULTIPLE_ORGS: {
      // If payload doesn't contain token
      if (!action || !action.payload || !action.payload.token || !action.payload.token.accessToken)
        return initialState;

      const { payload: { token: { accessToken } } } = action;
      setToken(accessToken);
      return {
        ...state,
        authenticationStatus: authenticationStatuses.MULTIPLE_ORGS,
      }
    }

    case types.FETCH_ORGS_FOR_USER_SUCCESS: {
      if (!action || !action.payload || !action.payload.organizations || !action.payload.organizations.length)
        return initialState;
      return {
        ...state,
        availableOrgs: [...action.payload.organizations],
      };
    }

    case types.SELECT_ORG_FOR_USER_SUCCESS: {
      // If payload doesn't contain token
      if (!action || !action.payload || !action.payload.accessToken)
        return initialState;

      const { payload: { accessToken } } = action;
      setToken(accessToken);
      return {
        ...state,
        authenticationStatus: authenticationStatuses.AUTHENTICATED,
      };
    }

    case types.LOGOUT:
      return {
        ...initialState,
        env: state.env
      };

    case types.LOGIN_FAILURE:
      setToken(null);
      return {
        ...state,
        authenticationStatus: authenticationStatuses.NOT_AUTHENTICATED,
      };

    default:
      return state;
  }
}

export default reducer;
