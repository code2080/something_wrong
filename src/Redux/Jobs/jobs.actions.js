import { asyncAction } from '../../Utils/actionHelpers';
import { getEnvParams } from '../../configs';
import * as types from './jobs.actionTypes';
import { Job } from '../../Models/Job.model';
import { schedulingAlgorithms } from '../../Constants/schedulingAlgorithms.constants';
import { activityStatuses } from '../../Constants/activityStatuses.constants';
import { SchedulingReturn } from '../../Models/SchedulingReturn.model';
import { schedulingModes } from '../../Constants/schedulingModes.constants';
import { selectCurrentConstraintConfigurationForForm } from '../ConstraintConfigurations/constraintConfigurations.selectors';

const fetchAllJobsFlow = {
  request: () => ({ type: types.FETCH_ALL_JOBS_REQUEST }),
  success: (response) => ({
    type: types.FETCH_ALL_JOBS_SUCCESS,
    payload: { ...response },
  }),
  failure: (err) => ({
    type: types.FETCH_ALL_JOBS_FAILURE,
    payload: { ...err },
  }),
};

export const fetchAllJobs = () =>
  asyncAction.GET({
    flow: fetchAllJobsFlow,
    endpoint: `${getEnvParams().AM_BE_URL}jobs?limit=200`,
  });

export const updateJobFromWS = (job) => ({
  type: types.UPDATE_JOB_SUCCESS,
  payload: { job },
});

const createJobFlow = {
  request: (params, postAction) => {
    const { callback, meta, activities } = postAction;
    if (meta.schedulingMode === schedulingModes.SINGLE) {
      callback(
        new SchedulingReturn({
          status: activityStatuses.QUEUED,
        }),
      );
    } else {
      callback(
        activities.map((a) => ({
          activityId: a._id,
          result: new SchedulingReturn({
            status: activityStatuses.QUEUED,
          }),
        })),
      );
    }
    return { type: types.CREATE_JOB_REQUEST };
  },
  success: (response, _params, _postAction) => ({
    type: types.CREATE_JOB_SUCCESS,
    payload: { ...response },
  }),
  failure: (err, params, postAction) => {
    const { callback, meta, activities } = postAction;
    if (meta.schedulingMode === schedulingModes.SINGLE) {
      callback(
        new SchedulingReturn({
          status: activityStatuses.FAILED,
          errorCode: err.code || -1,
          errorMessage: err.message || 'Failed to create job',
        }),
      );
    } else {
      callback(
        activities.map((a) => ({
          activityId: a._id,
          result: new SchedulingReturn({
            status: activityStatuses.FAILED,
            errorCode: err.code || -1,
            errorMessage: err.message || 'Failed to create job',
          }),
        })),
      );
    }
    return { type: types.CREATE_JOB_FAILURE, payload: { ...err } };
  },
};

export const createJob = ({
  activities = [],
  type = schedulingAlgorithms.UNKNOWN,
  formId,
  formInstanceIds = [],
  callback = null,
  meta = {},
}) => async (dispatch, getState) => {
  const storeState = await getState();
  const {
    auth: { coreUserId },
  } = storeState;
  const currentConstraintConfiguration = selectCurrentConstraintConfigurationForForm(
    storeState,
    formId,
  );
  const job = new Job({
    activities,
    type,
    formId,
    formInstanceIds,
    constraintConfigurationId: currentConstraintConfiguration?._id || null,
    userId: coreUserId,
  });
  dispatch(
    asyncAction.POST({
      flow: createJobFlow,
      endpoint: `${getEnvParams().AM_BE_URL}jobs`,
      params: job,
      postAction: { callback, meta, activities },
    }),
  );
};

const abortJobFlow = {
  request: () => ({ type: types.ABORT_JOB_REQUEST }),
  success: (response) => ({
    type: types.ABORT_JOB_SUCCESS,
    payload: { ...response },
  }),
  failure: (err) => ({ type: types.ABORT_JOB_FAILURE, payload: { ...err } }),
};

export const abortJob = ({ jobId, formId }) => async (dispatch) =>
  dispatch(
    asyncAction.POST({
      flow: abortJobFlow,
      endpoint: `${getEnvParams().AM_BE_URL}jobs/${jobId}/stop`,
      params: { formId },
    }),
  );
