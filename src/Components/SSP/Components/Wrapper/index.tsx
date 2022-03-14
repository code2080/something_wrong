import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  EFilterInclusions,
  EFilterType,
  ESortDirection,
  ISSPFilterQuery,
  ISSPReducerState,
} from 'Types/SSP.type';
import SSPResourceContext from '../../Utils/context';
import { FilterObject, TSSPWrapperProps } from '../../Types';
import { mergeWith, pick, cloneDeep } from 'lodash';
import {
  getFilterCache,
  setFilterCache,
} from 'Components/SSP/Utils/cacheService';
import {
  customFilterPathMergeWith,
  recursivelyTrimKeys,
  recursivelyTrimKeys2,
} from 'Components/SSP/Utils/helpers';

const SSPResourceWrapper: React.FC<TSSPWrapperProps> = ({
  name,
  selectorFn,
  fetchFn,
  fetchFilterLookupsFn,
  initSSPStateFn,
  initialFilters,
  children,
}) => {
  const dispatch = useDispatch();

  /**
   * SELECTORS
   */
  // Fetch pagination data from the redux state
  const {
    // STATUS
    loading,
    hasErrors,
    // DATA
    results,
    map,
    // PAGINATION
    page,
    limit,
    totalPages,
    // SORTING
    sortBy,
    direction,
    // FILTERS
    matchType,
    inclusion,
    filters,
    filterLookupMap,
    // SELECTION
    allKeys,
  }: ISSPReducerState = useSelector(selectorFn);

  /**
   * PAGINATION
   */
  const nextPage = () =>
    !!(page + 1 <= totalPages) && dispatch(fetchFn({ page: page + 1 }));
  const prevPage = () =>
    !!(page - 1 >= 1) && dispatch(fetchFn({ page: page - 1 }));
  const setPage = (_page: number) => {
    if (_page >= 1 && _page <= totalPages) {
      dispatch(fetchFn({ page: _page }));
    }
  };
  const setLimit = (_limit: number) =>
    !!(_limit > 0) && dispatch(fetchFn({ page: 1, limit: _limit }));

  /**
   * SELECTION
   */
  const [_selectedKeys, _setSelectedKeys] = useState<string[]>([]);
  const setSelectedKeys = (keys: string[]) => _setSelectedKeys(keys);
  const selectAllKeys = () => _setSelectedKeys(allKeys);

  /**
   * SORTING
   */
  const setSorting = (
    sortBy: string | undefined,
    direction: ESortDirection | undefined,
  ) => {
    dispatch(fetchFn({ sortBy, direction }));
  };

  /**
   * FILTERS
   */
  const [_matchType, _setMatchType] = useState<EFilterType>(matchType);
  const [_inclusion, _setInclusion] = useState(inclusion);
  const [_filters, _setFilters] = useState(filters);

  const setMatchType = (matchType: EFilterType) => _setMatchType(matchType);
  const setInclusion = (
    inclusion: Record<string, EFilterInclusions | boolean>,
  ) => _setInclusion(inclusion);
  const patchInclusion = (
    patch: Record<string, EFilterInclusions | boolean>,
  ) => {
    _setInclusion({ ..._inclusion, ...patch });
  };
  const setFilters = (filters: FilterObject) => _setFilters(filters);
  const patchFilters = (patch: FilterObject) => {
    const clonedObj = cloneDeep(_filters);
    mergeWith(clonedObj, patch, customFilterPathMergeWith);
    const noEmptyKeysObj = recursivelyTrimKeys2(clonedObj);
    _setFilters(noEmptyKeysObj);
  };

  const discardFilterChanges = () => {
    _setMatchType(matchType);
    _setInclusion(inclusion);
    _setFilters(filters);
  };

  const commitFilterChanges = () => {
    const filterQuery: ISSPFilterQuery = {
      matchType: _matchType,
      inclusion: _inclusion,
      filters: _filters,
    };
    setFilterCache(name, filterQuery);
    dispatch(fetchFn(filterQuery));
  };

  const initFiltersForDatasourceWithCacheAndDefaults = (
    defaultFilters: Partial<ISSPFilterQuery> = {},
  ) => {
    /**
     * Initial filters are either cached filters
     * or default filters provided as an argument to the function
     */
    const initFilters = getFilterCache(name) || defaultFilters;
    /**
     * Pick filter parameters
     */
    const { matchType, inclusion, filters } = pick(initFilters, [
      'matchType',
      'inclusion',
      'filters',
    ]);
    /**
     * Init in redux state and in local state
     */
    matchType && _setMatchType(matchType);
    inclusion && _setInclusion(inclusion);
    filters && _setFilters(filters);
    dispatch(initSSPStateFn({ matchType, inclusion, filters }));
  };

  /**
   * EFFECTS
   */
  useEffect(() => {
    // Start by setting initial filters
    initFiltersForDatasourceWithCacheAndDefaults(initialFilters);
    // Initial fetch on mount with default values
    dispatch(fetchFn());
    fetchFilterLookupsFn && dispatch(fetchFilterLookupsFn());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SSPResourceContext.Provider
      value={{
        // STATUS
        name,
        loading,
        hasErrors,
        // DATA
        results,
        map,
        // PAGINATION
        page,
        limit,
        totalPages,
        nextPage,
        prevPage,
        setPage,
        setLimit,
        // FILTERS
        matchType: _matchType,
        inclusion: _inclusion,
        filters: _filters,
        setMatchType,
        setInclusion,
        setFilters,
        patchInclusion,
        patchFilters,
        initFilters: initFiltersForDatasourceWithCacheAndDefaults,
        commitFilterChanges,
        discardFilterChanges,
        filterLookupMap,
        // SELECTION
        selectedKeys: _selectedKeys,
        setSelectedKeys,
        selectAllKeys,
        // SORTING
        setSorting,
        sortBy,
        direction,
      }}
    >
      {children}
    </SSPResourceContext.Provider>
  );
};

export default SSPResourceWrapper;
