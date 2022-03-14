import { isEmpty, mergeWith, pick } from 'lodash';
import { ISSPReducerState, ISSPQueryObject } from 'Types/SSP.type';
import { FilterObject } from '../Types';

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
  /** Base case */
  if (!oldVal || Array.isArray(newVal)) {
    return newVal;
    // return isEmpty(newVal) ? undefined : newVal;
  }

  mergeWith(oldVal, newVal, customFilterPathMergeWith);

  return oldVal;
};

//todo: Daniel version recursivelyTrimKeys2
/**
 * Filter without empty arrays or empty objects.
 * @param filter
 * @returns
 */
export const trimFilterKeysRecursive = (filter: FilterObject) => {
  return Object.entries(filter).reduce(
    (trimmedFilter: FilterObject, [key, value]) => {
      /** Base case: We have arrived at a leaf */
      if (Array.isArray(value)) {
        // We've established it's a leaf, if the leaf is empty we trim it
        if (isEmpty(value)) {
          return trimmedFilter;
        }

        return { ...trimmedFilter, [key]: value };
      }

      const deepTrim = trimFilterKeysRecursive(value);

      /** If the trim results in an empty object (all keys trimmed) we trim the
       * object */
      if (isEmpty(deepTrim)) {
        return trimmedFilter;
      }

      return { ...trimmedFilter, [key]: deepTrim };
    },
    {},
  );
};
