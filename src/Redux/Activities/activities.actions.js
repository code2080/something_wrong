/* eslint-disable no-unused-vars */
import { asyncAction } from '../../Utils/actionHelpers';
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
  MANUALLY_OVERRIDE_ACTIVITY_VALUE_REQUEST,
  MANUALLY_OVERRIDE_ACTIVITY_VALUE_SUCCESS,
  MANUALLY_OVERRIDE_ACTIVITY_VALUE_FAILURE,
  UPDATE_ACTIVITY_REQUEST,
  UPDATE_ACTIVITY_SUCCESS,
  UPDATE_ACTIVITY_FAILURE,
  SCHEDULE_ACTIVITIES_REQUEST,
  SCHEDULE_ACTIVITIES_SUCCESS,
  SCHEDULE_ACTIVITIES_FAILURE,
  REVERT_TO_SUBMISSION_VALUE_REQUEST,
  REVERT_TO_SUBMISSION_VALUE_SUCCESS,
  REVERT_TO_SUBMISSION_VALUE_FAILURE,
  UPDATE_ACTIVITIES_REQUEST,
  UPDATE_ACTIVITIES_SUCCESS,
  UPDATE_ACTIVITIES_FAILURE,
  DELETE_ACTIVITIES_FOR_FORM_INSTANCE_REQUEST,
  DELETE_ACTIVITIES_FOR_FORM_INSTANCE_SUCCESS,
  DELETE_ACTIVITIES_FOR_FORM_INSTANCE_FAILURE,
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
    endpoint: `forms/${encodeURIComponent(formId)}/activities`,
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
    endpoint: `form-instances/${encodeURIComponent(formInstanceId)}/activities`,
    params: { formInstanceId, formId },
  });

const saveActivitiesFlow = {
  request: () => ({ type: SAVE_ACTIVITIES_FOR_FORM_INSTANCE_REQUEST }),
  success: response => ({ type: SAVE_ACTIVITIES_FOR_FORM_INSTANCE_SUCCESS, payload: { ...response } }),
  failure: err => ({ type: SAVE_ACTIVITIES_FOR_FORM_INSTANCE_FAILURE, payload: { ...err } }),
};

export const saveActivities = (formId, formInstanceId, activities) =>
  asyncAction.POST({
    flow: saveActivitiesFlow,
    endpoint: `form-instances/${encodeURIComponent(formInstanceId)}/activities`,
    params: {
      formId,
      formInstanceId,
      activities,
    },
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
    endpoint: `form-instances/${encodeURIComponent(activity).formInstanceId}/activities/${encodeURIComponent(activity._id)}`,
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
    endpoint: `form-instances/${encodeURIComponent(activity).formInstanceId}/activities/${encodeURIComponent(activity._id)}`,
    params: {
      activity: updatedActivity,
    },
  });
}

const deleteActivitiesFlow = {
  request: () => ({ type: DELETE_ACTIVITIES_FOR_FORM_REQUEST }),
  success: response => ({ type: DELETE_ACTIVITIES_FOR_FORM_SUCCESS, payload: { ...response } }),
  failure: err => ({ type: DELETE_ACTIVITIES_FOR_FORM_FAILURE, payload: { ...err } }),
};

export const deleteActivities = formId =>
  asyncAction.DELETE({
    flow: deleteActivitiesFlow,
    endpoint: `forms/${encodeURIComponent(formId)}/activities`,
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
    endpoint: `form-instances/${encodeURIComponent(formInstanceId)}/activities`,
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
    endpoint: `form-instances/${encodeURIComponent(activity).formInstanceId}/activities/${encodeURIComponent(activity._id)}`,
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
    endpoint: `form-instances/${encodeURIComponent(formInstanceId)}/activities`,
    params: {
      formId,
      formInstanceId,
      activities
    }
  });

export const scheduleActivity = ({ apiFn, callback, activity }) => (dispatch, getState) => {
  /**
   * 1. Determine timing mode (timing mode determines what we need to do)
   * 2. If timing mode === EXACT
   * 2a  => collect all determined values (incl. manual overrides)
   * 2b  => get first available object for non determined values
   * 2c  => attempt to schedule (if there's objects available)
   * 2d  => store scheduling result
   * 3. If timing mode === TIMESLOTS
   * 3a  => collect all determined values (incl. manual overrides)
   * 3b  => for non determined objects, get availability matrix for all possible objects during timeslot
   * 3c  => determine optimal combination of objects
   * 3d  => attempt to schedule (if there's objects available)
   * 3e  => store scheduling result
   */
};
