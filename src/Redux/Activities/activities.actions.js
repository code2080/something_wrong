/* eslint-disable no-unused-vars */
import { asyncAction } from '../../Utils/actionHelpers';
import { getEnvParams } from '../../configs';
import {
  FETCH_ACTIVITIES_FOR_FORM_REQUEST,
  FETCH_ACTIVITIES_FOR_FORM_SUCCESS,
  FETCH_ACTIVITIES_FOR_FORM_FAILURE,

  FETCH_ACTIVITIES_FOR_FORM_INSTANCE_REQUEST,
  FETCH_ACTIVITIES_FOR_FORM_INSTANCE_SUCCESS,
  FETCH_ACTIVITIES_FOR_FORM_INSTANCE_FAILURE,

  SAVE_ACTIVITIES_FOR_FORM_INSTANCE_REQUEST,
  SAVE_ACTIVITIES_FOR_FORM_INSTANCE_SUCCESS,
  SAVE_ACTIVITIES_FOR_FORM_INSTANCE_FAILURE,

  DELETE_ACTIVITIES_FOR_FORM_REQUEST,
  DELETE_ACTIVITIES_FOR_FORM_SUCCESS,
  DELETE_ACTIVITIES_FOR_FORM_FAILURE,

  DELETE_ACTIVITIES_FOR_FORM_INSTANCE_REQUEST,
  DELETE_ACTIVITIES_FOR_FORM_INSTANCE_SUCCESS,
  DELETE_ACTIVITIES_FOR_FORM_INSTANCE_FAILURE,

  MANUALLY_OVERRIDE_ACTIVITY_VALUE_REQUEST,
  MANUALLY_OVERRIDE_ACTIVITY_VALUE_SUCCESS,
  MANUALLY_OVERRIDE_ACTIVITY_VALUE_FAILURE,

  REVERT_TO_SUBMISSION_VALUE_REQUEST,
  REVERT_TO_SUBMISSION_VALUE_SUCCESS,
  REVERT_TO_SUBMISSION_VALUE_FAILURE,

  UPDATE_ACTIVITY_REQUEST,
  UPDATE_ACTIVITY_SUCCESS,
  UPDATE_ACTIVITY_FAILURE,

  UPDATE_ACTIVITIES_REQUEST,
  UPDATE_ACTIVITIES_SUCCESS,
  UPDATE_ACTIVITIES_FAILURE,

  REORDER_ACTIVITIES_REQUEST,
  REORDER_ACTIVITIES_SUCCESS,
  REORDER_ACTIVITIES_FAILURE,
  SET_SCHEDULING_STATUS_OF_ACTIVITIES_REQUEST,
  SET_SCHEDULING_STATUS_OF_ACTIVITIES_SUCCESS,
  SET_SCHEDULING_STATUS_OF_ACTIVITIES_FAILURE,
} from './activities.actionTypes';

import { manuallyOverrideActivityValue, revertActivityValueToSubmission } from './activities.helpers';

const fetchActivitiesForFormFlow = {
  request: () => ({ type: FETCH_ACTIVITIES_FOR_FORM_REQUEST }),
  success: response => ({ type: FETCH_ACTIVITIES_FOR_FORM_SUCCESS, payload: { ...response } }),
  failure: err => ({ type: FETCH_ACTIVITIES_FOR_FORM_FAILURE, payload: { ...err } }),
};

export const fetchActivitiesForForm = formId =>
  asyncAction.GET({
    flow: fetchActivitiesForFormFlow,
    endpoint: `${getEnvParams().AM_BE_URL}activity`,
    params: { formId },
  });

const fetchActivitiesForFormInstanceFlow = {
  request: () => ({ type: FETCH_ACTIVITIES_FOR_FORM_INSTANCE_REQUEST }),
  success: response => ({ type: FETCH_ACTIVITIES_FOR_FORM_INSTANCE_SUCCESS, payload: { ...response } }),
  failure: err => ({ type: FETCH_ACTIVITIES_FOR_FORM_INSTANCE_FAILURE, payload: { ...err } }),
};

export const fetchActivitiesForFormInstance = (formId, formInstanceId) =>
  asyncAction.GET({
    flow: fetchActivitiesForFormInstanceFlow,
    endpoint: `${getEnvParams().AM_BE_URL}activity`,
    params: { formInstanceId, formId },
  });

const saveActivitiesFlow = {
  request: () => ({ type: SAVE_ACTIVITIES_FOR_FORM_INSTANCE_REQUEST }),
  success: response => ({ type: SAVE_ACTIVITIES_FOR_FORM_INSTANCE_SUCCESS, payload: { ...response } }),
  failure: err => ({ type: SAVE_ACTIVITIES_FOR_FORM_INSTANCE_FAILURE, payload: { ...err } }),
};

export const saveActivities = (formId, formInstanceId, callback) =>
  asyncAction.POST({
    flow: saveActivitiesFlow,
    endpoint: `${getEnvParams().AM_BE_URL}activity?formInstanceId=${formInstanceId}`,
    params: {
      formId,
      formInstanceId,
    },
    callback,
  });

const manuallyOverrideActivityValueFlow = {
  request: () => ({ type: MANUALLY_OVERRIDE_ACTIVITY_VALUE_REQUEST }),
  success: response => ({ type: MANUALLY_OVERRIDE_ACTIVITY_VALUE_SUCCESS, payload: { ...response } }),
  failure: err => ({ type: MANUALLY_OVERRIDE_ACTIVITY_VALUE_FAILURE, payload: { ...err } }),
};

export const overrideActivityValue = (newValue, activityValue, activity) => {
  const updatedActivity = manuallyOverrideActivityValue(newValue, activityValue, activity);
  return asyncAction.PUT({
    flow: manuallyOverrideActivityValueFlow,
    endpoint: `${getEnvParams().AM_BE_URL}activity/${activity._id}`,
    params: {
      activity: updatedActivity,
    },
  });
};

const revertToSubmissionValueFlow = {
  request: () => ({ type: REVERT_TO_SUBMISSION_VALUE_REQUEST }),
  success: response => ({ type: REVERT_TO_SUBMISSION_VALUE_SUCCESS, payload: { ...response } }),
  failure: err => ({ type: REVERT_TO_SUBMISSION_VALUE_FAILURE, payload: { ...err } }),
};

export const revertToSubmissionValue = (activityValue, activity) => {
  const updatedActivity = revertActivityValueToSubmission(activityValue, activity);
  return asyncAction.PUT({
    flow: revertToSubmissionValueFlow,
    endpoint: `${getEnvParams().AM_BE_URL}activity/${activity._id}`,
    params: {
      activity: updatedActivity,
    },
  });
};

const deleteActivitiesFlow = {
  request: () => ({ type: DELETE_ACTIVITIES_FOR_FORM_REQUEST }),
  success: response => ({ type: DELETE_ACTIVITIES_FOR_FORM_SUCCESS, payload: { ...response } }),
  failure: err => ({ type: DELETE_ACTIVITIES_FOR_FORM_FAILURE, payload: { ...err } }),
};

export const deleteActivities = formId =>
  asyncAction.DELETE({
    flow: deleteActivitiesFlow,
    endpoint: `${getEnvParams().AM_BE_URL}activity?formId=${formId}`,
    params: { formId }
  });

const deleteActivitiesInFormInstanceFlow = {
  request: () => ({ type: DELETE_ACTIVITIES_FOR_FORM_INSTANCE_REQUEST }),
  success: response => ({ type: DELETE_ACTIVITIES_FOR_FORM_INSTANCE_SUCCESS, payload: { ...response } }),
  failure: err => ({ type: DELETE_ACTIVITIES_FOR_FORM_INSTANCE_FAILURE, payload: { ...err } }),
};

export const deleteActivitiesInFormInstance = (formId, formInstanceId) =>
  asyncAction.DELETE({
    flow: deleteActivitiesInFormInstanceFlow,
    endpoint: `${getEnvParams().AM_BE_URL}activity?formInstanceId=${formInstanceId}`,
    params: { formId, formInstanceId }
  });

const updateActivityFlow = {
  request: () => ({ type: UPDATE_ACTIVITY_REQUEST }),
  success: response => ({ type: UPDATE_ACTIVITY_SUCCESS, payload: { ...response } }),
  failure: err => ({ type: UPDATE_ACTIVITY_FAILURE, payload: { ...err } }),
};

export const updateActivity = activity =>
  asyncAction.PUT({
    flow: updateActivityFlow,
    endpoint: `${getEnvParams().AM_BE_URL}activity/${activity._id}`,
    params: { activity }
  });

const updateActivitiesFlow = {
  request: () => ({ type: UPDATE_ACTIVITIES_REQUEST }),
  success: response => ({ type: UPDATE_ACTIVITIES_SUCCESS, payload: { ...response } }),
  failure: err => ({ type: UPDATE_ACTIVITIES_FAILURE, payload: { ...err } }),
};

export const updateActivities = (formId, formInstanceId, activities) =>
  asyncAction.PUT({
    flow: updateActivitiesFlow,
    endpoint: `${getEnvParams().AM_BE_URL}activity`,
    params: {
      formId,
      formInstanceId,
      activities
    }
  });

export const setSchedulingStatusOfActivitiesFlow = {
  request: () => ({ type: SET_SCHEDULING_STATUS_OF_ACTIVITIES_REQUEST }),
  success: response => ({ type: SET_SCHEDULING_STATUS_OF_ACTIVITIES_SUCCESS, payload: { ...response } }),
  failure: err => ({ type: SET_SCHEDULING_STATUS_OF_ACTIVITIES_FAILURE, payload: { ...err } }),
};

export const setSchedulingStatusOfActivities = (formId, schedulingStatuses) =>
  asyncAction.POST({
    flow: setSchedulingStatusOfActivitiesFlow,
    endpoint: `${getEnvParams().AM_BE_URL}forms/${formId}/activities/scheduling-status`,
    params: {
      schedulingStatuses,
    },
  });

const reorderActivitiesFlow = {
  request: ({ formId, formInstanceId, sourceIdx, destinationIdx }) => ({
    type: REORDER_ACTIVITIES_REQUEST,
    payload: { formId, formInstanceId, sourceIdx, destinationIdx },
  }),
  success: response => ({ type: REORDER_ACTIVITIES_SUCCESS, payload: { ...response } }),
  failure: err => ({ type: REORDER_ACTIVITIES_FAILURE, payload: { ...err } }),
};

export const reorderActivities = (formId, formInstanceId, sourceIdx, destinationIdx) =>
  asyncAction.PUT({
    flow: reorderActivitiesFlow,
    endpoint: `${getEnvParams().AM_BE_URL}activity/form-instances/${formInstanceId}`,
    params: {
      formId,
      formInstanceId,
      sourceIdx,
      destinationIdx,
    },
  });
