import { asyncAction } from '../../Utils/actionHelpers';
import * as types from './constraints.actionTypes';
import { getEnvParams } from '../../configs';

const fetchConstraintsFlow = {
  request: () => ({ type: types.FETCH_CONSTRAINTS_REQUEST }),
  success: (response) => ({
    type: types.FETCH_CONSTRAINTS_SUCCESS,
    payload: { ...response },
  }),
  failure: (err) => ({
    type: types.FETCH_CONSTRAINTS_FAILURE,
    payload: { ...err },
  }),
};

export const fetchConstraints = () =>
  asyncAction.GET({
    flow: fetchConstraintsFlow,
    endpoint: `${getEnvParams().AM_BE_URL}constraints`,
  });
