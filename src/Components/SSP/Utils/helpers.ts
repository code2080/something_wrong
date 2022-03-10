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

/**
 * Removes value at {pathToDelete} in {filters}. If the removal resolves in an
 * empty object, that object will also be deleted. This will be done recursivly
 * so that no paths related to {pathToDelete} leads to an empty object.
 * @param filters
 * @param pathToDelete
 * @returns filters without value or resulting empty objects in pathToDelete
 */
export const removeDeepEntry = (
  filters: Record<string, any>,
  pathToDelete: string[],
) => {
  //todo: maybe enough with a shallow clone
  const filtersCopy = cloneDeep(filters);

  console.log('filtersCopy', filtersCopy);

  unset(filtersCopy, pathToDelete);

  console.log('filtersCopy after mutation', filtersCopy);

  const remainingPath = initial(pathToDelete);
  const newLastItemInPath = get(filtersCopy, remainingPath);

  console.log('remainingPath', remainingPath);
  console.log('newLastItemInPath', newLastItemInPath);

  /** Base case */
  if (!isEmpty(newLastItemInPath) || remainingPath.length === 1) {
    return filtersCopy;
  }

  /** If the mutation lead to an empty object, we need to delete that object too
   * */
  return removeDeepEntry(filtersCopy, remainingPath);
};
