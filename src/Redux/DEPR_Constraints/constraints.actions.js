import { asyncAction } from '../../Utils/actionHelpers';
import { getEnvParams } from '../../configs';
import * as types from './constraints.actionTypes';

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
