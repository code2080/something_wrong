import { isEmpty, mergeWith, pick } from 'lodash';
import { TActivityFilterMapObject } from 'Types/Activity/ActivityFilterLookupMap.type';
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
    'groupBy',
    'matchType',
    'inclusion',
    'filters',
  ]);
  const finalGroupBy = partialQueryObject?.groupBy || sspQueryParams.groupBy;

  const groupedParams = pick(state.data[finalGroupBy], [
    'page',
    'limit',
    'sortBy',
    'direction',
  ]);

  const finalQueryObjectJSON = Object.assign(
    sspQueryParams,
    groupedParams,
    partialQueryObject,
  );
  const finalQueryObject = JSON.stringify(finalQueryObjectJSON);
  const urlParams = new URLSearchParams({ ssp: finalQueryObject });
  return urlParams.toString();
};

export const customFilterPathMergeWith = (oldVal: any, newVal: any) => {
  /** Base case */
  if (!oldVal || Array.isArray(newVal)) return newVal;
  mergeWith(oldVal, newVal, customFilterPathMergeWith);

  return oldVal;
};

/**
 * Filter without empty arrays or empty objects.
 * @param filter
 * @returns
 */
export const recursivelyTrimFilterKeys = (filter: TActivityFilterMapObject) => {
  return Object.entries(filter).reduce(
    (trimmedFilter: TActivityFilterMapObject, [key, value]) => {
      /** Base case: We have arrived at a leaf */
      if (Array.isArray(value)) {
        // We've established it's a leaf, if the leaf is empty we trim it
        if (isEmpty(value)) {
          return trimmedFilter;
        }

        return { ...trimmedFilter, [key]: value };
      }

      const deepTrim = recursivelyTrimFilterKeys(value);

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
