import { asyncAction } from '../../Utils/actionHelpers';
import { getEnvParams } from '../../configs';
import * as types from './jobs.actionTypes';

export const updateJobFromWS = (job) => ({
  type: types.UPDATE_JOB_SUCCESS,
  payload: { job },
});

const abortJobFlow = {
  request: () => ({ type: types.ABORT_JOB_REQUEST }),
  success: (response) => ({
    type: types.ABORT_JOB_SUCCESS,
    payload: { ...response },
  }),
  failure: (err) => ({ type: types.ABORT_JOB_FAILURE, payload: { ...err } }),
};

export const abortJob =
  ({ formId }) =>
  async (dispatch) =>
    dispatch(
      asyncAction.POST({
        flow: abortJobFlow,
        endpoint: `${getEnvParams().AM_BE_URL}jobs/${formId}/stop`,
        params: { formId },
      }),
    );
