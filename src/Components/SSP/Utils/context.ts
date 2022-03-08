import React from "react";
import { EFilterType, ESortDirection, ISSPResourceContext } from "Types/SSP.type";

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
  // SORTING
  sortBy: '',
  direction: ESortDirection.DESCENDING,
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