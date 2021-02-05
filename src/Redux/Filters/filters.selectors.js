import { createSelector } from 'reselect';

const filterstate = state => state.filters;

export const selectFilter = createSelector(
  filterstate,
  filters => (filterId, filterInterface = {}) => {
    if (!filters)
      return filterInterface;
    const f = filters[filterId];
    return {
      ...filterInterface,
      ...(f || {})
    }
  }
);
