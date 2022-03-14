import { INITIAL_FILTER_VALUES } from 'Components/DEPR_ActivityFiltering/FilterModal/FilterModal.constants';
import FilterLookUpMap from '../../Types/DEPR_FilterLookUp.type';
import * as types from './filters.actionTypes';
import { initialState } from './filters.initialState';

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

    case types.SET_FILTER: {
      if (!action || !action.payload || !action.payload.filterId) return state;
      const { filterId, filter } = action.payload;
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
      const key = `${formId}${origin || ''}`;
      return {
        ...state,
        [key]: values,
      };
    }

    case types.RESET_FORM_FILTER_VALUES: {
      const { formId } = action.payload;
      return {
        ...state,
        [formId]: INITIAL_FILTER_VALUES,
      };
    }

    default:
      return state;
  }
};

export default reducer;
