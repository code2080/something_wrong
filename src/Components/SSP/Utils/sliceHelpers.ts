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
    const { results, page, limit, totalPages, groupBy, allKeys }: ISSPAPIResult = payload;

    const finalGroupBy = groupBy || state.groupBy;

    const iteratedResults = results.map((el: any) => createFn(el));

    const map = iteratedResults.reduce(
      (tot: any[], acc: any) => ({
        ...tot,
        [acc[idProp]]: acc,
      }),
      {},
    );

    state.data[finalGroupBy].results = iteratedResults;
    state.data[finalGroupBy].map = map;
    state.data[finalGroupBy].page = page;
    state.data[finalGroupBy].limit = limit;
    state.data[finalGroupBy].totalPages = totalPages;
    state.data[finalGroupBy].allKeys = allKeys;

  } catch (error) {
    console.error(error);
  }
};

export const commitSSPQueryToState = (
  payload: Partial<ISSPQueryObject>,
  state: ISSPReducerState,
) => {
  const { page, limit, sortBy, groupBy, direction, matchType, inclusion, filters } =
    payload;
  const finalGroupBy = groupBy || state.groupBy;
  
  state.groupBy = finalGroupBy;
  state.data[finalGroupBy].page = page || state.data[finalGroupBy].page;
  state.data[finalGroupBy].limit = limit || state.data[finalGroupBy].limit;
  state.data[finalGroupBy].sortBy = sortBy;
  state.data[finalGroupBy].direction = direction;
  state.matchType = matchType || state.matchType;
  state.inclusion = inclusion || state.inclusion;
  state.filters = filters || state.filters;
};

export const updateStateWithResultFromBatchOperation = (
  batchOperationPayload: TActivityBatchOperation,
  state: ISSPReducerState,
  idProp = '_id'
) => {
  /**
   * @todo updates to one of the groups should update all groups
   */
  const { data } = batchOperationPayload;
  const results = state.data[state.groupBy].results.map((entity) => {
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

  state.data[state.groupBy].results = results;
  state.data[state.groupBy].map = map;
}
