import { TActivityFilterMapObject } from './Activity/ActivityFilterLookupMap.type';
import { EActivityGroupings } from './Activity/ActivityGroupings.enum';

export enum EFilterType {
  ONE = 'ONE',
  ALL = 'ALL',
}

export const CFilterTypeArr = [
  { label: 'Match all', value: EFilterType.ALL },
  { label: 'Match one', value: EFilterType.ONE },
];

export enum ESortDirection {
  ASCENDING = 'asc',
  DESCENDING = 'desc',
}

// enum EQueryObject {
//   NONE = 'NONE',
// }

export enum EFilterInclusions {
  INCLUDE = 'INCLUDE',
  EXCLUDE = 'EXCLUDE',
  ONLY = 'ONLY',
}

export const DEFAULT_PAGE_SIZE = 100;

export interface ISSPFilterQuery {
  matchType: EFilterType;
  inclusion: Record<string, EFilterInclusions | boolean>;
  filters: TActivityFilterMapObject;
}

export interface ISSPSortingQuery {
  sortBy: string | undefined;
  direction: ESortDirection | undefined;
}

export interface ISSPGroupingQuery {
  groupBy: EActivityGroupings;
}

export interface ISSPPaginationQuery {
  page: number;
  limit: number;
}

export interface ISSPAPIStatus {
  hasErrors: boolean;
  loading: boolean;
  filterLookupMapLoading: boolean;
}

export interface ISSPAPIResult {
  queryHash: number;
  results: any[];
  page: number;
  groupBy: EActivityGroupings;
  allKeys: string[];
  limit: number;
  totalPages: number;
  workerStatus?: 'IN_PROGRESS' | 'DONE' | string;
}

export interface ISSAPIDataGroupState
  extends Omit<ISSPAPIResult, 'queryHash' | 'groupBy'>,
    ISSPSortingQuery {
  map: { [id: string]: any };
}

export interface ISSPReducerState extends ISSPAPIStatus, ISSPFilterQuery {
  // STATUS
  /**
   * From ISSAPIStatus:
   * hasErrors: boolean,
   * loading: boolean,
   */
  // DATA
  groupBy: EActivityGroupings;
  data: { [group in any]: ISSAPIDataGroupState };
  // FILTERS
  /**
   * From ISSPFilterQuery
   * matchType: EFilterType,
   * inclusion: Record<string, EFilterInclusions | boolean>
   * filters: Record<string, any>
   */
  filterLookupMap: any;
  // WORKERS
  workerStatus?: 'IN_PROGRESS' | 'DONE' | string;
}

export interface ISSPQueryObject
  extends ISSPFilterQuery,
    ISSPSortingQuery,
    ISSPGroupingQuery,
    ISSPPaginationQuery {}

export interface ISSPResourceContext
  extends Omit<ISSPReducerState, 'allKeys' | 'data'> {
  name: string;
  // PAGINATION FUNCTIONS
  nextPage: () => void;
  prevPage: () => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  // SELECTION
  selectedKeys: string[];
  setSelectedKeys: (keys: string[]) => void;
  selectAllKeys: () => void;
  // SORTING
  setSorting: (
    sortBy: string | undefined,
    direction?: ESortDirection | undefined,
  ) => void;
  // FILTERING
  setMatchType: (matchType: EFilterType) => void;
  setInclusion: (
    inclusion: Record<string, EFilterInclusions | boolean>,
  ) => void;
  patchInclusion: (patch: Record<string, EFilterInclusions | boolean>) => void;
  setFilters: (filters: TActivityFilterMapObject) => void;
  patchFilters: (patch: TActivityFilterMapObject) => void;
  commitFilterChanges: (patch?: TActivityFilterMapObject) => void;
  discardFilterChanges: () => void;
  initFilters: (defaultFilters: Partial<ISSPFilterQuery>) => void;
  // GROUPING COVENIENCE FNs
  setGroup: (groupBy: EActivityGroupings) => void;
  results: any[];
  map: { [id: string]: any };
  page: number;
  totalPages: number;
  limit: number;
  sortBy: string | undefined;
  direction: ESortDirection | undefined;
  // EVERYTHING
  applyMultipleSSPChanges: (args: Partial<ISSPQueryObject>) => void;
}
