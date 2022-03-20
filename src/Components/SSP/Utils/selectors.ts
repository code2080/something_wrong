import { ISSPReducerState } from 'Types/SSP.type';
import { IState } from 'Types/State.type';

export const selectSSPState =
  (sliceName: string) =>
  (state: IState): ISSPReducerState => ({
    // STATUS
    hasErrors: state[sliceName].hasErrors,
    loading: state[sliceName].loading,
    workerStatus: state[sliceName].workerStatus || undefined,
    // DATA
    data: state[sliceName].data,
    // GROUPING
    groupBy: state[sliceName].groupBy,
    // FILTERS
    matchType: state[sliceName].matchType,
    inclusion: state[sliceName].inclusion,
    filters: state[sliceName].filters,
    filterLookupMap: state[sliceName].filterLookupMap,
  });
