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
  request: ({ activityIds, formId }) => ({
    type: types.SCHEDULING_ACTIVITY_REQUEST,
    payload: { activityIds, formId },
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

const schedulingActivityByFormInstanceIdFlow = {
  request: ({ formId, formInstanceId }) => ({
    type: types.SCHEDULING_ACTIVITY_FORM_INSTANCE_ID_REQUEST,
    payload: { formId, formInstanceId },
  }),
  success: (response) => ({
    type: types.SCHEDULING_ACTIVITY_FORM_INSTANCE_ID_SUCCESS,
    payload: { ...response },
  }),
  failure: (err) => ({
    type: types.SCHEDULING_ACTIVITY_FORM_INSTANCE_ID_FAILED,
    payload: { ...err },
  }),
};

export const schedulingActivity = ({
  activityIds,
  formId,
  coreUserId,
  isBeta = false,
}) =>
  asyncAction.POST({
    flow: schedulingActivityFlow,
    endpoint: `${getEnvParams().AM_BE_URL}activity/scheduling`,
    params: { activityIds, coreUserId, formId, isBeta },
  });

export const schedulingActivityByFormInstanceId = ({
  formInstanceId,
  formId,
  coreUserId,
  isBeta = false,
}) =>
  asyncAction.POST({
    flow: schedulingActivityByFormInstanceIdFlow,
    endpoint: `${
      getEnvParams().AM_BE_URL
    }activity/form-instances/${formInstanceId}/scheduling`,
    params: { coreUserId, formId, formInstanceId, isBeta },
  });
