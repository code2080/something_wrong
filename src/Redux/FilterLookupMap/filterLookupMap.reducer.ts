import FilterLookUpMap from 'Types/FilterLookUp.type';
import * as types from './filterLookupMap.actionTypes';
import { initialValue } from './filterLookupMap.initialValue';

export default (state = initialValue, action) => {
  switch (action.type) {
    case types.FETCH_ACTIVITY_FILTER_LOOKUP_MAP_SUCCESS: {
      const { formId, lookupMap } = action.payload;
      return {
        ...state,
        activities: {
          ...state.activities,
          [formId]: new FilterLookUpMap(lookupMap),
        },
      };
    }

    default:
      return state;
  }
};
