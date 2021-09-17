import { createSelector } from 'reselect';

const stateSelector = (state) => state.filterLookupMap;

export const selectFormActivityLookupMap = (formId: string) =>
  createSelector(
    stateSelector,
    (filterLookupMap) => filterLookupMap.activities[formId] || {},
  );
