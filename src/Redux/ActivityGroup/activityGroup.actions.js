/* eslint-disable no-unused-vars */
import { asyncAction } from '../../Utils/actionHelpers';
import { getEnvParams } from '../../configs';
import {
  FETCH_ACTIVITY_GROUPS_REQUEST,
  FETCH_ACTIVITY_GROUPS_SUCCESS,
  FETCH_ACTIVITY_GROUPS_FAILURE,
  CREATE_ACTIVITY_GROUP_REQUEST,
  CREATE_ACTIVITY_GROUP_SUCCESS,
  CREATE_ACTIVITY_GROUP_FAILURE,
  UPDATE_ACTIVITY_GROUP_REQUEST,
  UPDATE_ACTIVITY_GROUP_SUCCESS,
  UPDATE_ACTIVITY_GROUP_FAILURE,
  DELETE_ACTIVITY_GROUP_REQUEST,
  DELETE_ACTIVITY_GROUP_SUCCESS,
  DELETE_ACTIVITY_GROUP_FAILURE,
  ASSIGN_ACTIVITIES_TO_GROUP_REQUEST,
  ASSIGN_ACTIVITIES_TO_GROUP_SUCCESS,
  ASSIGN_ACTIVITIES_TO_GROUP_FAILURE,
} from './activityGroup.actionTypes';

const fetchActivityGroupsForFormFlow = {
  request: () => ({ type: FETCH_ACTIVITY_GROUPS_REQUEST }),
  success: response => ({ type: FETCH_ACTIVITY_GROUPS_SUCCESS, payload: { ...response } }),
  failure: err => ({ type: FETCH_ACTIVITY_GROUPS_FAILURE, payload: { ...err } }),
};

export const fetchActivityGroupsForForm = formId =>
  asyncAction.GET({
    flow: fetchActivityGroupsForFormFlow,
    endpoint: `${getEnvParams().AM_BE_URL}forms/${formId}/activity-groups`,
    params: { formId },
  });

export const createActivityGroupFlow = {
  request: () => ({ type: CREATE_ACTIVITY_GROUP_REQUEST }),
  success: response => ({ type: CREATE_ACTIVITY_GROUP_SUCCESS, payload: { ...response } }),
  failure: err => ({ type: CREATE_ACTIVITY_GROUP_FAILURE, payload: { ...err } }),
};

export const createActivityGroup = (formId, activityGroupBody) =>
  asyncAction.POST({
    flow: createActivityGroupFlow,
    endpoint: `${getEnvParams().AM_BE_URL}forms/${formId}/activity-groups`,
    params: { ...activityGroupBody },
  });

const assignActivityToGroupFlow = {
  request: () => ({ type: ASSIGN_ACTIVITIES_TO_GROUP_REQUEST }),
  success: response => ({ type: ASSIGN_ACTIVITIES_TO_GROUP_SUCCESS, payload: { ...response } }),
  failure: err => ({ type: ASSIGN_ACTIVITIES_TO_GROUP_FAILURE, payload: { ...err } }),
};

export const assignActivityToGroup = (formId, activityGroupId, activityIds) =>
  asyncAction.POST({
    flow: assignActivityToGroupFlow,
    endpoint: `${getEnvParams().AM_BE_URL}forms/${formId}/activity-groups/${activityGroupId}/activities`,
    params: { formId, activityIds },
  });

export const updateActivityGroupFlow = {
  request: () => ({ type: UPDATE_ACTIVITY_GROUP_REQUEST }),
  success: response => ({ type: UPDATE_ACTIVITY_GROUP_SUCCESS, payload: { ...response } }),
  failure: err => ({ type: UPDATE_ACTIVITY_GROUP_FAILURE, payload: { ...err } }),
};

export const updateActivityGroup = (formId, activityGroupId, name) =>
  asyncAction.PATCH({
    flow: updateActivityGroupFlow,
    endpoint: `${getEnvParams().AM_BE_URL}forms/${formId}/activity-groups/${activityGroupId}`,
    params: { name },
  });

const deleteActivityGroupFlow = {
  request: () => ({ type: DELETE_ACTIVITY_GROUP_REQUEST }),
  success: response => ({ type: DELETE_ACTIVITY_GROUP_SUCCESS, payload: { ...response } }),
  failure: err => ({ type: DELETE_ACTIVITY_GROUP_FAILURE, payload: { ...err } }),
};

export const deleteActivityGroup = (formId, activityGroupId) =>
  asyncAction.DELETE({
    flow: deleteActivityGroupFlow,
    endpoint: `${getEnvParams().AM_BE_URL}forms/${formId}/activity-groups/${activityGroupId}`,
    params: { activityGroupId, formId },
  });
