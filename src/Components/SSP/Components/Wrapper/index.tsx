import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { mergeWith, pick, cloneDeep } from 'lodash';

// UTILS
import {
  customFilterPathMergeWith,
  recursivelyTrimFilterKeys,
} from 'Components/SSP/Utils/helpers';
import {
  getFilterCache,
  setFilterCache,
} from 'Components/SSP/Utils/cacheService';

// TYPES
import {
  EFilterInclusions,
  EFilterType,
  ESortDirection,
  ISSPFilterQuery,
  ISSPQueryObject,
  ISSPReducerState,
} from 'Types/SSP.type';
import SSPResourceContext from '../../Utils/context';
import { TSSPWrapperProps } from '../../Types';
import { EActivityGroupings } from 'Types/Activity/ActivityGroupings.enum';
import { TActivityFilterMapObject } from 'Types/Activity/ActivityFilterLookupMap.type';

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
    filterLookupMapLoading,
    workerStatus,
    // DATA
    data,
    // GROUP BY
    groupBy,
    // FILTERS
    matchType,
    inclusion,
    filters,
    filterLookupMap,
  }: ISSPReducerState = useSelector(selectorFn);

  const {
    [groupBy]: {
      page,
      limit,
      totalPages,
      allKeys,
      results,
      map,
      sortBy,
      direction,
    },
  } = data;

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
  const getSelectedActivityIds = (): string[] => {
    switch (groupBy) {
      case EActivityGroupings.FLAT:
        return _selectedKeys;
      case EActivityGroupings.WEEK_PATTERN:
      case EActivityGroupings.TAG:
        return _selectedKeys
          .flatMap((id) => data[groupBy].map[id]?.activityIds)
          .filter((id) => id);
    }
  }
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
  const setFilters = (filters: TActivityFilterMapObject) =>
    _setFilters(filters);

  const applyFilterPatch = (
    patch: TActivityFilterMapObject,
  ): TActivityFilterMapObject => {
    const clonedObj = cloneDeep(_filters);
    mergeWith(clonedObj, patch, customFilterPathMergeWith);
    const noEmptyKeysObj = recursivelyTrimFilterKeys(clonedObj);
    return noEmptyKeysObj;
  };
  const patchFilters = (patch: TActivityFilterMapObject) => {
    const appliedPatch = applyFilterPatch(patch);
    _setFilters(appliedPatch);
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
    dispatch(fetchFn({ ...filterQuery, page: 1 }));
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
   * GROUPING
   */
  const setGroup = (groupBy: EActivityGroupings) => {
    dispatch(fetchFn({ groupBy }));
  };

  /**
   * MISC
   */
   const applyMultipleSSPChanges = (args: Partial<ISSPQueryObject>) => {
    /**
     * IF we have filter changes as part of the args,
     * we need to patch our local filter state to make sure
     * the filter modal reflects the new filters
     */
    const { inclusion, matchType, filters } = args;
    if (inclusion) patchInclusion(inclusion);
    if (matchType) setMatchType(matchType);
    if (filters) patchFilters(filters);

    /**
     * We also potentially need to update our filter local storage cache
     * We can not rely on our patchFilters functions to have updated our state date,
     * hence we prefer to use - if available - the filter data being passed into the function
     */
    const filterQuery: ISSPFilterQuery = {
      matchType: matchType || _matchType,
      inclusion: inclusion || _inclusion,
      filters: filters || _filters,
    };
    setFilterCache(name, filterQuery);

    /**
     * Dispatch the fetch function with all the possible SSP query parameters
     */
    dispatch(fetchFn({ ...args, page: 1 }));
  };

  const [metadata, setMetadata] = useState<Record<string, any>>({});
  const _setMetadata = (updMetadata: Record<string, any>) => {
    setMetadata(updMetadata);
    dispatch(fetchFn({ metadata: updMetadata }));
  };
  const patchMetadata = (prop: string, value: any) => {
    const updMetadata = { ...metadata, [prop]: value };
    _setMetadata(updMetadata);
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

  /**
   * Reset selected keys when changing grouping
   */
  useEffect(() => {
    setSelectedKeys([]);
  }, [groupBy]);

  return (
    <SSPResourceContext.Provider
      value={{
        // STATUS
        name,
        loading,
        filterLookupMapLoading,
        hasErrors,
        workerStatus,
        // DATA
        map,
        results,
        // GROUPING
        groupBy,
        setGroup,
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
        getSelectedActivityIds,
        // SORTING
        setSorting,
        sortBy,
        direction,
        // MISC
        applyMultipleSSPChanges,
        metadata,
        setMetadata: _setMetadata,
        patchMetadata,
      }}
    >
      {children}
    </SSPResourceContext.Provider>
  );
};

export default SSPResourceWrapper;
