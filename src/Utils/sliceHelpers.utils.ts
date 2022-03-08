import { ISSPAPIResult, ISSPReducerState } from '../Types/SSP.type'

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

export const commitAPIPayloadToState = (payload: ISSPAPIResult, state: ISSPReducerState, createFn: Function, idProp: string = '_id'): void => {
  try {
    const { results, page, limit, totalPages }: ISSPAPIResult = payload;
    const iteratedResults = results.map((el: any) => createFn(el));

    const map = iteratedResults.reduce((tot: any[], acc: any) => ({
      ...tot,
      [acc[idProp]]: acc,
    }), {});

    state.results = iteratedResults;
    state.map = map;
    state.page = page;
    state.limit = limit;
    state.totalPages = totalPages;
  } catch (error) {
    console.error(error);
  } 
};
