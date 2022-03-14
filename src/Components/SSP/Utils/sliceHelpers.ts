import { omit } from 'lodash';
import { TActivityBatchOperation } from 'Types/Activity/ActivityBatchOperations.type';
import {
  ISSPAPIResult,
  ISSPQueryObject,
  ISSPReducerState,
} from '../../../Types/SSP.type';

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
    console.log('Start')
    console.log(Date.now().valueOf());
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
    console.log('End')
    console.log(Date.now().valueOf());
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

export const updateStateWithResultFromBatchOperation = (
  batchOperationPayload: TActivityBatchOperation,
  state: ISSPReducerState,
  idProp = '_id'
) => {
  const { data } = batchOperationPayload;
  const results = state.results.map((entity) => {
    // Check if el exists in array
    const batchOp = data.find((op) => op._id === entity._id);
    if (batchOp) return { ...entity, ...omit(batchOp, '_id') };
    return entity;
  });
  const map = results.reduce(
    (tot: any[], acc: any) => ({
      ...tot,
      [acc[idProp]]: acc,
    }),
    {},
  );

  state.results = results;
  state.map = map;
}
