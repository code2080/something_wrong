import _ from 'lodash';
import { asyncAction } from '../../Utils/actionHelpers';
import { getEnvParams } from '../../configs';
import * as types from './jobs.actionTypes';
import { Job } from '../../Models/Job.model';
import { schedulingAlgorithms } from '../../Constants/schedulingAlgorithms.constants';
import { activityStatuses } from '../../Constants/activityStatuses.constants';
import { SchedulingReturn } from '../../Models/SchedulingReturn.model';
import { updateActivities } from '../Activities/activities.actions';
import { updateActivitiesWithSchedulingResults } from '../../Utils/scheduling.helpers';
import { schedulingModes } from '../../Constants/schedulingModes.constants';

const fetchAllJobsFlow = {
  request: () => ({ type: types.FETCH_ALL_JOBS_REQUEST }),
  success: response => ({ type: types.FETCH_ALL_JOBS_SUCCESS, payload: { ...response } }),
  failure: err => ({ type: types.FETCH_ALL_JOBS_FAILURE, payload: { ...err } }),
};

export const fetchAllJobs = () =>
  asyncAction.GET({
    flow: fetchAllJobsFlow,
    endpoint: `${getEnvParams().AE_OL_URL}jobs`,
  });

const createJobFlow = {
  request: () => ({ type: types.CREATE_JOB_REQUEST }),
  success: (response, params, postAction) => {
    const { callback, meta, activities } = postAction;
    if (meta.schedulingMode === schedulingModes.SINGLE) {
      callback(
        new SchedulingReturn({
          status: activityStatuses.QUEUED,
        })
      );
    } else {
      callback(activities.map(a => ({
        activityId: a._id,
        result: new SchedulingReturn({
          status: activityStatuses.QUEUED,
        })
      })));
    }
    return ({ type: types.CREATE_JOB_SUCCESS, payload: { ...response } });
  },
  failure: (err, params, postAction) => {
    const { callback, meta, activities } = postAction;
    if (meta.schedulingMode === schedulingModes.SINGLE) {
      callback(
        new SchedulingReturn({
          status: activityStatuses.FAILED,
          errorCode: -1,
          errorMessage:
            'Failed to create job'
        })
      );
    } else {
      callback(activities.map(a => ({
        activityId: a._id,
        result: new SchedulingReturn({
          status: activityStatuses.FAILED,
          errorCode: -1,
          errorMessage:
            'Failed to create job'
        })
      })));
    }
    return ({ type: types.CREATE_JOB_FAILURE, payload: { ...err } })
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
  const { auth: { org, integrationSettings } } = storeState;
  const job = new Job({
    activities,
    type,
    organizationId: org._id,
    formId,
    formInstanceIds,
    customerSignature: org.customerSignature || '',
    username: integrationSettings.username,
    password: integrationSettings.password,
  });
  dispatch(asyncAction.POST({
    flow: createJobFlow,
    endpoint: `${getEnvParams().AE_OL_URL}jobs`,
    params: job,
    postAction: { callback, meta, activities },
  }));
}

const abortJobFlow = {
  request: () => ({ type: types.ABORT_JOB_REQUEST }),
  success: (response, params, postAction) => {
    const { formId, formInstanceId, activities, dispatch, getState } = postAction;

    // Create the scheduling return
    const schedulingReturns = activities.map(a => ({
      activityId: a._id,
      result: new SchedulingReturn({
        status: activityStatuses.NOT_SCHEDULED,
        reservationId: null,
      })
    }));

    // Get all activities on the form instance (no guarantee they're all on the activities in post action)
    const storeState = getState();
    const formInstanceActivities = _.get(storeState, `activities.${formId}.${formInstanceId}`, []);
    const updatedActivities = formInstanceActivities.map(a => {
      const aIdx = activities.findIndex(el => el._id.toString() === a._id.toString());
      if (aIdx > -1)
        return activities[aIdx];
      return a;
    });
    const payload = updateActivitiesWithSchedulingResults(updatedActivities, schedulingReturns);
    console.log(payload);
    dispatch(updateActivities(
      formId,
      formInstanceId,
      payload
    ));
    return ({ type: types.ABORT_JOB_SUCCESS, payload: { ...response } });
  },
  failure: (err) => ({ type: types.CREATE_JOB_FAILURE, payload: { ...err } }),
};

export const abortJob = ({
  jobId,
  formId,
  formInstanceId,
  activities,
}) => async (dispatch, getState) => dispatch(asyncAction.POST({
  flow: abortJobFlow,
  endpoint: `${getEnvParams().AE_OL_URL}jobs/${jobId}/stop`,
  postAction: { formId, formInstanceId, activities, dispatch, getState },
}));
