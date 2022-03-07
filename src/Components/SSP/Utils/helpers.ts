import { pick } from "lodash";
import { ISSPReducerState, ISSPQueryObject } from "Types/SSP.type";

/**
 * @function serializeSSPQuery
 * @description takes a partial query object from a wrapped SSP component, and merges it with the current redux state to create a full ISSPQueryObject
 * @param {Partial<ISSPQueryObject> | undefined} partialQueryObject 
 * @param {ISSPReducerState} state 
 * @returns {string}
 */
export const serializeSSPQuery = (partialQueryObject: Partial<ISSPQueryObject> | undefined, state: ISSPReducerState): string => {
  const sspQueryParams = pick(state, ['page', 'limit', 'sortBy', 'direction']);
  const finalQueryObject = Object.assign(sspQueryParams, partialQueryObject);
  const urlParams = new URLSearchParams(finalQueryObject as unknown as Record<string, string>);
  return urlParams.toString();
};