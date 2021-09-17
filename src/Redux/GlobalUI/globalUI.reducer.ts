import { FETCH_ACTIVITIES_FOR_FORM_SUCCESS } from '../Activities/activities.actionTypes';
import * as types from './globalUI.actionTypes';

// INITIAL STATE
import initialState from './globalUI.initialState';

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_FORM_DETAIL_TAB: {
      const { tab, submission = null } = action.payload;
      return {
        ...state,
        selectedFormDetailTab: tab,
        selectedFormDetailSubmission: submission,
        tabHistory: [
          ...state.tabHistory,
          {
            tab,
            payload: {
              submission,
            },
          },
        ].slice(0, 20), // Only keep 20 latest tabChanged
      };
    }

    case types.SET_BREADCRUMBS: {
      if (!action || !action.payload || !action.payload.fragments) return state;
      const { fragments } = action.payload;
      return {
        ...state,
        breadcrumbs: fragments,
      };
    }

    case types.SET_EXTERNAL_ACTION: {
      return {
        ...state,
        spotlightPositionInfo: action.payload.spotlightPositionInfo,
      };
    }

    case types.GET_VIEW_SUCCESS: {
      if (
        !action ||
        !action.payload ||
        !action.payload.table ||
        !action.payload.table.datasourceId ||
        !action.payload.table.columns
      ) {
        return state;
      }

      const {
        table: { datasourceId, columns },
      } = action.payload;
      if (!datasourceId || !columns) return state;
      return {
        ...state,
        tableViews: {
          ...state.tableViews,
          [datasourceId]: columns,
        },
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
      const {
        payload: { datasourceId, columns },
      } = action;
      return {
        ...state,
        tableViews: {
          ...state.tableViews,
          [datasourceId]: { ...columns },
        },
      };
    }

    case types.SET_SORTING_FOR_ACTIVITIES: {
      const {
        payload: { formId, columnKey, direction, tableType },
      } = action;
      const key = columnKey;
      return {
        ...state,
        activitySorting: {
          ...state.activitySorting,
          [formId]: {
            ...state.activitySorting[formId],
            [tableType]: {
              ...state.activitySorting[formId],
              sortParams: { key, direction },
              tableType,
            },
          },
        },
      };
    }

    case types.RESET_SORTING_FOR_ACTIVITIES: {
      const {
        payload: { formId, tableType },
      } = action;
      return {
        ...state,
        activitySorting: {
          ...state.activitySorting,
          [formId]: {
            ...state.activitySorting[formId],
            [tableType]: null,
          },
        },
      };
    }

    case FETCH_ACTIVITIES_FOR_FORM_SUCCESS: {
      const {
        payload: {
          activities,
          actionMeta: { formId },
        },
      } = action;
      if (!action || !action.payload) return state;
      return {
        ...state,
        activitySorting: {
          ...state.activitySorting,
          [formId]: {
            ...state.activitySorting[formId],
            activityTable: {
              ...state.activitySorting[formId]?.activityTable,
              sortOrder: activities.map((a) => a._id),
            },
            jointTeachingTable: {
              ...state.activitySorting[formId]?.jointTeachingTable,
              sortOrder: activities.map((a) => a._id),
            },
          },
        },
      };
    }

    case types.SET_UNMATCHED_ACTIVITIES: {
      const {
        payload: { formId, activities },
      } = action;

      return {
        ...state,
        jointTeaching: {
          ...state.jointTeaching,
          [formId]: {
            ...state.jointTeaching[formId],
            activities,
          },
        },
      };
    }

    default:
      return state;
  }
};

export default reducer;
