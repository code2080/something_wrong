import { TActivity } from "./Activity.type";

export enum EFilterType {
  ONE = 'ONE',
  ALL = 'ALL',
};

export const CFilterTypeArr = [
  { label: 'Match all', value: EFilterType.ALL },
  { label: 'Match one', value: EFilterType.ONE }
];

export enum ESortDirection {
  ASCENDING = 'asc',
  DESCENDING = 'desc',
};

enum EQueryObject {
  NONE = 'NONE',
}

export enum EFilterInclusions {
  INCLUDE = 'INCLUDE',
  EXCLUDE = 'EXCLUDE',
  ONLY = 'ONLY',
};

export const DEFAULT_PAGE_SIZE = 100;

export interface ISSPFilterQuery {
  matchType: EFilterType,
  inclusion: Record<string, EFilterInclusions | boolean>,
  filters: Record<string, any>,
};

export interface ISSPSortingQuery {
  sortBy: string,
  direction: ESortDirection,
};

export interface ISSPGroupingQuery {
  groupBy: EQueryObject.NONE | 'WEEK_PATTERN',
};

export interface ISSPPaginationQuery {
  page: number;
  limit: number;
};

export interface ISSPAPIStatus {
  hasErrors: boolean;
  loading: boolean;
}

export interface ISSPAPIResult {
  queryHash: number;
  results: any[],
  page: number,
  limit: number,
  totalPages: number,
};

export interface ISSPReducerState extends ISSPAPIStatus, Omit<ISSPAPIResult, 'queryHash'>, ISSPPaginationQuery, ISSPSortingQuery, ISSPFilterQuery {
  // STATUS
  /**
   * From ISSAPIStatus:
   * hasErrors: boolean,
   * loading: boolean,
   */
  // DATA
  // From ISSPAPIResult
  // results: any[], 
  map: { [id: string]: TActivity },
  // PAGINATION
  /**
   * From ISSPPaginationQuery & ISSPAPIResult
   * page: number;
   * limit: number;
   * totalPages: number;
   */
  // SORTING
  /**
   * From ISSPSortingQuery
   * sortBy: string;
   * direction: ESortDirection
   */
  // FILTERS
  /**
   * From ISSPFilterQuery
   * matchType: EFilterType,
   * inclusion: Record<string, EFilterInclusions | boolean>
   * filters: Record<string, any>
   */
  filterLookupMap: any;
};

export interface ISSPQueryObject extends ISSPFilterQuery, ISSPSortingQuery, ISSPGroupingQuery, ISSPPaginationQuery {};

export interface ISSPResourceContext extends ISSPReducerState {
  name: string;
  // PAGINATION FUNCTIONS
  nextPage: () => void;
  prevPage: () => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  // SELECTION
  selectedKeys: string[];
  setSelectedKeys: (keys: string[]) => void;
  // SORTING
  setSorting: (sortBy: string, direction?: ESortDirection) => void;
  // FILTERING
  setMatchType: (matchType: EFilterType) => void;
  setInclusion: (inclusion: Record<string, EFilterInclusions | boolean>) => void;
  patchInclusion: (patch: Record<string, EFilterInclusions | boolean>) => void;
  setFilters: (filters: Record<string, any>) => void;
  patchFilters: (patch: Record<string, any>) => void;
  commitFilterChanges: () => void;
  discardFilterChanges: () => void;
  initFilters: (defaultFilters: Partial<ISSPFilterQuery>) => void;
};

