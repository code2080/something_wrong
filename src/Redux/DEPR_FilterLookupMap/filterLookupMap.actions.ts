import { asyncAction } from 'Utils/actionHelpers';
import { getEnvParams } from 'configs';
import * as types from './filterLookupMap.actionTypes';

const fetchLookupMapFlow = {
  request: () => ({ type: types.FETCH_ACTIVITY_FILTER_LOOKUP_MAP }),
  success: (response) => ({
    type: types.FETCH_ACTIVITY_FILTER_LOOKUP_MAP_SUCCESS,
    payload: { ...response },
  }),
  failure: (err) => ({
    type: types.FETCH_ACTIVITY_FILTER_LOOKUP_MAP_FAILURE,
    payload: { ...err },
  }),
};

export const fetchActivityFilterLookupMap = ({ formId }) => {
  return asyncAction.GET({
    flow: fetchLookupMapFlow,
    endpoint: `${getEnvParams().AM_BE_URL}forms/${formId}/activities/filters`,
    params: { formId },
  });
};
