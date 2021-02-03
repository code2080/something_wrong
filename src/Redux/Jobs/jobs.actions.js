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
import { AEBETA_PERMISSIION } from '../../Constants/permissions.constants';

const fetchAllJobsFlow = {
  request: () => ({ type: types.FETCH_ALL_JOBS_REQUEST }),
  success: response => ({ type: types.FETCH_ALL_JOBS_SUCCESS, payload: { ...response } }),
  failure: err => ({ type: types.FETCH_ALL_JOBS_FAILURE, payload: { ...err } }),
};

export const fetchAllJobs = () =>
  asyncAction.GET({
    flow: fetchAllJobsFlow,
    endpoint: `${getEnvParams().AM_BE_URL}jobs?limit=200`,
    permission: AEBETA_PERMISSIION,
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
  const { auth: { org, integrationSettings, coreUserId } } = storeState;
  const { formPeriod } = storeState.forms[formId];
  const job = new Job({
    activities,
    type,
    formId,
    formInstanceIds,
    userId: coreUserId,
  });
  dispatch(asyncAction.POST({
    flow: createJobFlow,
    endpoint: `${getEnvParams().AM_BE_URL}jobs`,
    params: job,
    postAction: { callback, meta, activities },
    permission: AEBETA_PERMISSIION,
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
    if (updatedActivities && updatedActivities.length) {
      const payload = updateActivitiesWithSchedulingResults(updatedActivities, schedulingReturns);
      dispatch(updateActivities(
        formId,
        formInstanceId,
        payload
      ));
    }
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
  endpoint: `${getEnvParams().AM_BE_URL}jobs/${jobId}/stop`,
  postAction: { formId, formInstanceId, activities, dispatch, getState },
  permission: AEBETA_PERMISSIION,
}));
