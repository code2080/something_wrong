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

    case types.GET_VIEW_SUCCESS: {
      const { table: { datasourceId, columns } } = action.payload;
      if (!datasourceId || !columns) return state;
      return {
        ...state,
        tableViews: {
          ...state.tableViews,
          [datasourceId]: columns,
        }
      };
    }

    case types.INIT_VIEW: {
      const { datasourceId, columns } = action.payload;
      return {
        ...state,
        tableViews: {
          ...state.tableViews,
          [datasourceId]: { ...columns },
        },
      };
    }

    case types.UPDATE_VIEW_REQUEST: {
      const { payload: { datasourceId, columns } } = action;
      return {
        ...state,
        tableViews: {
          ...state.tableViews,
          [datasourceId]: { ...columns },
        },
      };
    }

    default:
      return state;
  }
}

export default reducer;
