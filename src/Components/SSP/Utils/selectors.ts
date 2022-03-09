import { ISSPReducerState } from 'Types/SSP.type';
import { IState } from 'Types/State.type';

export const selectSSPState =
  (sliceName: string) =>
  (state: IState): ISSPReducerState => ({
    // STATUS
    hasErrors: state[sliceName].hasErrors,
    loading: state[sliceName].loading,
    // DATA
    results: state[sliceName].results,
    map: state[sliceName].map,
    // PAGINATION
    page: state[sliceName].page,
    limit: state[sliceName].limit,
    totalPages: state[sliceName].totalPages,
    // SORTING
    sortBy: state[sliceName].sortBy,
    direction: state[sliceName].direction,
    // FILTERS
    matchType: state[sliceName].matchType,
    inclusion: state[sliceName].inclusion,
    filters: state[sliceName].filters,
    filterLookupMap: state[sliceName].filterLookupMap,
  });
