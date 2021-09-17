import FilterLookUpMap from '../../Types/FilterLookUp.type';
import * as types from './filters.actionTypes';
import { initialState } from './filters.initialState';

const loadFiltersFromLS = (filterId: string) => {
  const stringedFilter = localStorage.getItem(filterId);
  if (stringedFilter) return JSON.parse(stringedFilter);
  return {};
};

const saveFilterToLS = (filterId: string, filter: any) =>
  localStorage.setItem(filterId, JSON.stringify(filter));

const reducer = (state: any = initialState, action) => {
  switch (action.type) {
    case types.SET_ACTIVITY_FILTER_INCLUSION: {
      const { filterId, inclusion } = action.payload;
      console.log(action);
      return {
        ...state,
        [`${filterId}_ACTIVITIES_SETTINGS`]: {
          ...(state[`${filterId}_ACTIVITIES_SETTINGS`] || {}),
          inclusion,
        },
      };
    }

    case types.SET_ACTIVITY_FILTER_MODE: {
      const { filterId, mode } = action.payload;
      return {
        ...state,
        [`${filterId}_ACTIVITIES_SETTINGS`]: {
          ...(state[`${filterId}_ACTIVITIES_SETTINGS`] || {}),
          mode,
        },
      };
    }

    case types.SET_ACTIVITY_FILTER: {
      const { filterId, matches, options } = action.payload;
      return {
        ...state,
        [`${filterId}_ACTIVITIES_OPTIONS`]: options,
        [`${filterId}_ACTIVITIES_MATCHES`]: matches,
      };
    }

    case types.LOAD_FILTER: {
      const { filterId } = action.payload;
      const filter = loadFiltersFromLS(filterId);
      return {
        ...state,
        [filterId]: filter,
      };
    }

    case types.SET_FILTER: {
      if (!action || !action.payload || !action.payload.filterId) return state;
      const { filterId, filter } = action.payload;
      saveFilterToLS(filterId, filter);
      return {
        ...state,
        [filterId]: filter,
      };
    }

    case types.UPDATE_FILTER: {
      if (!action || !action.payload || !action.payload.filterId) return state;
      const { filterId, key, value } = action.payload;
      const updFilter = {
        ...(state[filterId] || {}),
        [key]: value,
      };
      saveFilterToLS(filterId, updFilter);
      return {
        ...state,
        [filterId]: {
          ...updFilter,
        },
      };
    }

    case types.FETCH_FORM_LOOKUPMAP_SUCCESS: {
      if (!action) return state;
      const { formId, lookupMap } = action.payload;
      return {
        ...state,
        [formId]: {
          ...(state[formId] || {}),
          filterLookup: new FilterLookUpMap(lookupMap),
        },
      } as { [formId: string]: { filterLookup: FilterLookUpMap } };
    }

    case types.SET_SELECTED_FILTER_VALUES: {
      if (!action) return state;
      const { filterValues, formId } = action.payload;
      return {
        ...state,
        [formId]: {
          ...(state[formId] ?? {}),
          filterValues,
        },
      };
    }

    case types.SET_FILTER_VALUES: {
      const { origin, formId, values } = action.payload;
      return {
        ...state,
        [origin]: {
          ...state[origin],
          [formId]: values,
        },
      };
    }

    case types.RESET_FORM_FILTER_VALUES: {
      const { formId } = action.payload;
      return {
        ...state,
        [formId]: {
          ...(state[formId] ?? {}),
          filterLookUp: {},
          filterValues: {},
        },
      };
    }

    default:
      return state;
  }
};

export default reducer;
