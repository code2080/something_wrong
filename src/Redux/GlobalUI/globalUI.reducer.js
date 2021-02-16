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

    case types.SET_EXTERNAL_ACTION: {
      return {
        ...state,
        spotlightPositionInfo: action.payload.spotlightPositionInfo
      };
    }

    case types.GET_VIEW_SUCCESS: {
      if (
        !action ||
        !action.payload ||
        !action.payload.table ||
        !action.payload.table.datasourceId ||
        !action.payload.table.columns
      ) { return state; }

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
};

export default reducer;
