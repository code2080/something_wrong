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

      const deepTrim = recursivelyTrimKeys(value);

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

export const recursivelyTrimKeys = (obj: any) =>
  Object.keys(obj).reduce((trimmedObj, key) => {
    /**
     * First thing we got to do is figure out if the value we're looking at is a leaf or not
     * In our data structure, a valid leaf is an array with a length > 0, hence below
     */
    const val: any = obj[key];
    if (Array.isArray(val)) {
      // We've established it's a leaf, let's check if it's a valid leaf
      if (val && val.length) return { ...trimmedObj, [key]: val };
      // Not a valid leaf, return trimmedObj as is
      return trimmedObj;
    }
    /**
     * Below is another assumption based on knowledge of our datastructure
     * but, since there's only two options for each value,
     * 1) a leaf in the form of [...vals] or 2) Record<string, Record<string, string[]> | string[]>,
     * we can safely recursively move down the tree without validating for primitives or other non iterables
     */
    const deepTrim = recursivelyTrimKeys(val);
    /**
     * Last piece of logic; we should only keep this key
     * if there's at least one key in the recursive return
     */
    if (Object.keys(deepTrim).length) return { ...trimmedObj, [key]: deepTrim };
    return trimmedObj;
  }, {});
