/* eslint-disable no-unused-vars */
import { asyncAction } from '../../Utils/actionHelpers';
import { getEnvParams } from '../../configs';
import {
  FETCH_ACTIVITY_TAGS_REQUEST,
  FETCH_ACTIVITY_TAGS_SUCCESS,
  FETCH_ACTIVITY_TAGS_FAILURE,
  CREATE_ACTIVITY_TAG_REQUEST,
  CREATE_ACTIVITY_TAG_SUCCESS,
  CREATE_ACTIVITY_TAG_FAILURE,
  UPDATE_ACTIVITY_TAG_REQUEST,
  UPDATE_ACTIVITY_TAG_SUCCESS,
  UPDATE_ACTIVITY_TAG_FAILURE,
  DELETE_ACTIVITY_TAG_REQUEST,
  DELETE_ACTIVITY_TAG_SUCCESS,
  DELETE_ACTIVITY_TAG_FAILURE,
  ASSIGN_ACTIVITIES_TO_TAG_REQUEST,
  ASSIGN_ACTIVITIES_TO_TAG_SUCCESS,
  ASSIGN_ACTIVITIES_TO_TAG_FAILURE,
} from './activityTag.actionTypes';

const fetchActivityTagsForFormFlow = {
  request: () => ({ type: FETCH_ACTIVITY_TAGS_REQUEST }),
  success: (response) => ({
    type: FETCH_ACTIVITY_TAGS_SUCCESS,
    payload: { ...response },
  }),
  failure: (err) => ({
    type: FETCH_ACTIVITY_TAGS_FAILURE,
    payload: { ...err },
  }),
};

export const fetchActivityTagsForForm = (formId) =>
  asyncAction.GET({
    flow: fetchActivityTagsForFormFlow,
    endpoint: `${getEnvParams().AM_BE_URL}forms/${formId}/activity-tags`,
    params: { formId },
  });

export const createActivityTagFlow = {
  request: () => ({ type: CREATE_ACTIVITY_TAG_REQUEST }),
  success: (response) => ({
    type: CREATE_ACTIVITY_TAG_SUCCESS,
    payload: { ...response },
  }),
  failure: (err) => ({
    type: CREATE_ACTIVITY_TAG_FAILURE,
    payload: { ...err },
  }),
};

export const createActivityTag = (formId, activityTagBody) =>
  asyncAction.POST({
    flow: createActivityTagFlow,
    endpoint: `${getEnvParams().AM_BE_URL}forms/${formId}/activity-tag`,
    params: { ...activityTagBody },
  });

const assignActivityToTagFlow = {
  request: () => ({ type: ASSIGN_ACTIVITIES_TO_TAG_REQUEST }),
  success: (response) => ({
    type: ASSIGN_ACTIVITIES_TO_TAG_SUCCESS,
    payload: { ...response },
  }),
  failure: (err) => ({
    type: ASSIGN_ACTIVITIES_TO_TAG_FAILURE,
    payload: { ...err },
  }),
};

export const assignActivityToTag = (formId, activityTagId, activityIds) =>
  asyncAction.POST({
    flow: assignActivityToTagFlow,
    endpoint: `${
      getEnvParams().AM_BE_URL
    }forms/${formId}/activity-tags/${activityTagId}/activities`,
    params: { formId, activityIds },
  });

export const updateActivityTagFlow = {
  request: () => ({ type: UPDATE_ACTIVITY_TAG_REQUEST }),
  success: (response) => ({
    type: UPDATE_ACTIVITY_TAG_SUCCESS,
    payload: { ...response },
  }),
  failure: (err) => ({
    type: UPDATE_ACTIVITY_TAG_FAILURE,
    payload: { ...err },
  }),
};

export const updateActivityTag = (formId, activityTagId, name) =>
  asyncAction.PATCH({
    flow: updateActivityTagFlow,
    endpoint: `${
      getEnvParams().AM_BE_URL
    }forms/${formId}/activity-tags/${activityTagId}`,
    params: { name },
  });

const deleteActivityTagFlow = {
  request: () => ({ type: DELETE_ACTIVITY_TAG_REQUEST }),
  success: (response) => ({
    type: DELETE_ACTIVITY_TAG_SUCCESS,
    payload: { ...response },
  }),
  failure: (err) => ({
    type: DELETE_ACTIVITY_TAG_FAILURE,
    payload: { ...err },
  }),
};

export const deleteActivityTag = (formId, activityTagId) =>
  asyncAction.DELETE({
    flow: deleteActivityTagFlow,
    endpoint: `${
      getEnvParams().AM_BE_URL
    }forms/${formId}/activity-tags/${activityTagId}`,
    params: { activityTagId, formId },
  });
