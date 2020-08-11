import * as types from './globalUI.actionTypes';

// INITIAL STATE
import initialState from './globalUI.initialState';

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_BREADCRUMBS: {
      if (!action || !action.payload || !action.payload.fragments) return state;
      const { fragments } = action.payload;
      return {
        ...state,
        breadcrumbs: fragments,
      };
    };

    case types.BEGIN_EXTERNAL_ACTION: {
      if (!action || !action.payload || !action.payload.prop || !action.payload.activityId) return state;
      const { payload: { prop, activityId } } = action;
      return {
        ...state,
        externalAction: { prop, activityId },
      };
    }

    case types.END_EXTERNAL_ACTION:
      return {
        ...state,
        externalAction: null,
      };

    default:
      return state;
  }
}

export default reducer;
