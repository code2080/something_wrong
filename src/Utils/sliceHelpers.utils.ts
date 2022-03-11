import {
  ISSPAPIResult,
  ISSPQueryObject,
  ISSPReducerState,
} from '../Types/SSP.type';

export const finishedLoadingSuccess = (state: ISSPReducerState): void => {
  state.loading = false;
  state.hasErrors = false;
};

export const finishedLoadingFailure = (state: ISSPReducerState): void => {
  state.loading = false;
  state.hasErrors = true;
};

export const beginLoading = (state: ISSPReducerState): void => {
  state.loading = true;
  state.hasErrors = false;
};

export const commitAPIPayloadToState = (
  payload: ISSPAPIResult,
  state: ISSPReducerState,
  createFn: Function,
  idProp: string = '_id',
): void => {
  try {
    const { results, page, limit, totalPages, allKeys }: ISSPAPIResult = payload;
    const iteratedResults = results.map((el: any) => createFn(el));

    const map = iteratedResults.reduce(
      (tot: any[], acc: any) => ({
        ...tot,
        [acc[idProp]]: acc,
      }),
      {},
    );

    state.results = iteratedResults;
    state.map = map;
    state.page = page;
    state.limit = limit;
    state.totalPages = totalPages;
    state.allKeys = allKeys;
  
  } catch (error) {
    console.error(error);
  }
};

export const commitSSPQueryToState = (
  payload: Partial<ISSPQueryObject>,
  state: ISSPReducerState,
) => {
  const { page, limit, sortBy, direction, matchType, inclusion, filters } =
    payload;
  state.page = page || state.page;
  state.limit = limit || state.limit;
  state.sortBy = sortBy;
  state.direction = direction;
  state.matchType = matchType || state.matchType;
  state.inclusion = inclusion || state.inclusion;
  state.filters = filters || state.filters;
};
