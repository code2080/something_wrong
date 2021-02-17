import * as types from './filters.actionTypes';

// eslint-disable-next-line no-undef
const loadFiltersFromLS = filterId => JSON.parse(localStorage.getItem(filterId)) || {};
// eslint-disable-next-line no-undef
const saveFilterToLS = (filterId, filter) => localStorage.setItem(filterId, JSON.stringify(filter));

const reducer = (state = {}, action) => {
  switch (action.type) {
    case types.LOAD_FILTER: {
      const { filterId } = action.payload;
      const filter = loadFiltersFromLS(filterId);
      return {
        ...state,
        [filterId]: filter,
      };
    };

    case types.SET_FILTER: {
      if (!action || !action.payload || !action.payload.filterId) return state;
      const { filterId, filter } = action.payload;
      saveFilterToLS(filterId, filter);
      return {
        ...state,
        [filterId]: filter,
      };
    };

    case types.UPDATE_FILTER: {
      if (!action || !action.payload || !action.payload.filterId) return state;
      const { filterId, key, value } = action.payload;
      const updFilter = {
        ...state[filterId],
        [key]: value,
      };
      saveFilterToLS(filterId, updFilter);
      return {
        ...state,
        [filterId]: updFilter,
      };
    };

    default:
      return state;
  }
};

export default reducer;
