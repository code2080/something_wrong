import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { EFilterInclusions, EFilterType, ESortDirection, ISSPReducerState } from 'Types/SSP.type';
import SSPResourceContext from '../../Utils/context';
import { TSSPWrapperProps } from '../../Types';

const SSPResourceWrapper: React.FC<TSSPWrapperProps> = ({ name, selectorFn, fetchFn, fetchFilterLookupsFn, children }) => {
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
  }: ISSPReducerState = useSelector(selectorFn);

  
  /**
   * PAGINATION
   */
  const nextPage = () => !!(page + 1 <= totalPages) && dispatch(fetchFn({ page: page + 1 }));
  const prevPage = () => !!(page - 1 >= 1) && dispatch(fetchFn({ page: page - 1 }));
  const setPage = (_page: number) => !!(_page >= 1 && _page <= totalPages) && dispatch(fetchFn({ page: _page }));
  const setLimit = (_limit: number) => !!(_limit > 0) && dispatch(fetchFn({ page: 1, limit: _limit }));

  /**
   * SELECTION
   */
  const [_selectedKeys, _setSelectedKeys] = useState<string[]>([]);
  const setSelectedKeys = (keys: string[]) => _setSelectedKeys(keys);

  /**
   * SORTING
   */
  const setSorting = (sortBy: string, direction: ESortDirection) => dispatch(fetchFn({ sortBy, direction }));

  /**
   * FILTERS
   */
  const [_matchType, _setMatchType] = useState<EFilterType>(matchType);
  const [_inclusion, _setInclusion] = useState(inclusion);
  const [_filters, _setFilters] = useState(filters);

  const setMatchType = (matchType: EFilterType) => _setMatchType(matchType);
  const setInclusion = (inclusion: Record<string, EFilterInclusions | boolean>) => _setInclusion(inclusion);
  const patchInclusion = (patch: Record<string, EFilterInclusions | boolean>) => {
    _setInclusion({ ...inclusion, ...patch });
  };
  const setFilters = (filters: Record<string, any>) => _setFilters(filters);
  const patchFilters = (patch: Record<string, any>) => {
    _setFilters({ ...filters, ...patch });
  };

  const discardFilterChanges = () => {
    _setMatchType(matchType);
    _setInclusion(inclusion);
    _setFilters(filters);
  };
  const commitFilterChanges = () => {
    dispatch(fetchFn({ matchType: _matchType, inclusion: _inclusion, filters: _filters }))
  };

  /**
   * EFFECTS
   */
  useEffect(() => {
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
        commitFilterChanges,
        discardFilterChanges,
        filterLookupMap,
        // SELECTION
        selectedKeys: _selectedKeys,
        setSelectedKeys,
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

