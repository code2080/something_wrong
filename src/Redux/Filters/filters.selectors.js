import { createSelector } from 'reselect';

const filterstate = state => state.filters;

export const selectFilter = createSelector(
  filterstate,
  filters => (filterId, filterInterface = {}) => ({ ...filterInterface, ...(filters[filterId] || {}) }),
);
