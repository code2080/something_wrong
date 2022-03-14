import React from 'react';
import {
  EFilterType,
  ISSPResourceContext,
} from 'Types/SSP.type';

const SSPResourceContext = React.createContext<ISSPResourceContext>({
  // STATUS
  name: 'Unknown resource',
  loading: false,
  hasErrors: false,
  // DATA
  results: [],
  map: {},
  // PAGINATION
  page: 1,
  limit: 100,
  totalPages: 1,
  nextPage: () => {},
  prevPage: () => {},
  setPage: () => {},
  setLimit: () => {},
  // SELECTION
  selectedKeys: [],
  setSelectedKeys: () => {},
  selectAllKeys: () => {},
  // SORTING
  sortBy: undefined,
  direction: undefined,
  setSorting: () => {},
  // FILTERS
  matchType: EFilterType.ONE,
  inclusion: {},
  filters: {},
  filterLookupMap: {},
  setMatchType: () => {},
  setInclusion: () => {},
  patchInclusion: () => {},
  setFilters: () => {},
  patchFilters: () => {},
  commitFilterChanges: () => {},
  discardFilterChanges: () => {},
  initFilters: () => {},
});

export default SSPResourceContext;