import { REPLACED_KEY } from 'Components/ActivitySSPFilters/constants';
import {
  isEmpty,
  mergeWith,
  pick,
  cloneDeep,
  unset,
  initial,
  get,
} from 'lodash';
import { ISSPReducerState, ISSPQueryObject } from 'Types/SSP.type';

/**
 * @function serializeSSPQuery
 * @description takes a partial query object from a wrapped SSP component, and merges it with the current redux state to create a full ISSPQueryObject
 * @param {Partial<ISSPQueryObject> | undefined} partialQueryObject
 * @param {ISSPReducerState} state
 * @returns {string}
 */
export const serializeSSPQuery = (
  partialQueryObject: Partial<ISSPQueryObject> | undefined,
  state: ISSPReducerState,
): any => {
  const sspQueryParams = pick(state, [
    'page',
    'limit',
    'sortBy',
    'direction',
    'matchType',
    'inclusion',
    'filters',
  ]);
  const finalQueryObject = JSON.stringify(
    Object.assign(sspQueryParams, partialQueryObject),
  );
  const urlParams = new URLSearchParams({ ssp: finalQueryObject });
  return urlParams.toString();
};

export const customFilterPathMergeWith = (oldVal: any, newVal: any) => {
  /** Base case*/
  if (!oldVal || Array.isArray(newVal)) {
    return newVal;
    // return isEmpty(newVal) ? undefined : newVal;
  }

  mergeWith(oldVal, newVal, customFilterPathMergeWith);

  return oldVal;
};

export const removeDeepEntry = (
  obj: Record<string, any>,
  pathToDelete: string[],
) => {
  const objCopy = cloneDeep(obj);

  unset(objCopy, pathToDelete);

  const remainingPath = initial(pathToDelete);
  const item = get(objCopy, remainingPath);

  /** Base case */
  if (!isEmpty(item)) {
    return objCopy;
  }

  return removeDeepEntry(objCopy, remainingPath);
};
