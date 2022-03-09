import { mergeWith, pick } from 'lodash';
import { ISSPReducerState, ISSPQueryObject } from 'Types/SSP.type';

/**
 * @function generateQueryFingerprint
 * @description generates a unique (ish) fingerprint from a string
 * @param {String} stringifiedQuery
 * @returns {Number}
 */
export const generateQueryFingerprint = (stringifiedQuery: string): number => {
  let hash = 0;
  if (stringifiedQuery.length === 0) return hash;
  for (let i = 0; i < stringifiedQuery.length; i++) {
    const char = stringifiedQuery.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

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
  const queryHash = generateQueryFingerprint(finalQueryObject);
  const urlParams = new URLSearchParams({ ssp: finalQueryObject });
  return { serializedQuery: urlParams.toString(), queryHash };
};

export const customFilterPathMergeWith = (oldVal: any, newVal: any) => {
  /** Base case*/
  if (!oldVal || Array.isArray(newVal)) {
    return newVal;
  }

  mergeWith(oldVal, newVal, customFilterPathMergeWith);

  return oldVal;
};
