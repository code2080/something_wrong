import { Key } from 'react';
import { asyncAction } from '../../Utils/actionHelpers';
import { getEnvParams } from '../../configs';
import * as types from './activityScheduling.actionTypes';

export const startSchedulingActivities = (
  activityIds: Array<string | Key>,
) => ({
  type: types.START_SCHEDULING_ACTIVITIES,
  payload: { activityIds },
});

export const finishSchedulingActivities = (
  activityIds: Array<string | Key>,
) => ({
  type: types.FINISH_SCHEDULING_ACTIVITIES,
  payload: { activityIds },
});

const schedulingActivityFlow = {
  request: () => ({
    type: types.SCHEDULING_ACTIVITY_REQUEST,
  }),
  success: (response) => ({
    type: types.SCHEDULING_ACTIVITY_SUCCESS,
    payload: { ...response },
  }),
  failure: (err) => ({
    type: types.SCHEDULING_ACTIVITY_FAILED,
    payload: { ...err },
  }),
};

export const schedulingActivity = ({ activityIds, coreUserId }) =>
  asyncAction.POST({
    flow: schedulingActivityFlow,
    endpoint: `${getEnvParams().AM_BE_URL}activity/scheduling`,
    params: { activityIds, coreUserId },
  });
