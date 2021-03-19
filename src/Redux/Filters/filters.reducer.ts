import * as types from './filters.actionTypes';

// eslint-disable-next-line no-undef
const loadFiltersFromLS = (filterId: string) => {
  const stringedFilter = localStorage.getItem(filterId);
  if (stringedFilter) return JSON.parse(stringedFilter);
  return {};
};
// eslint-disable-next-line no-undef
const saveFilterToLS = (filterId: string, filter: any) =>
  localStorage.setItem(filterId, JSON.stringify(filter));

const reducer = (state = {}, action) => {
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

    default:
      return state;
  }
};

export default reducer;
