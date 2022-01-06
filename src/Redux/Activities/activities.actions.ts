import { isEmptyDeep } from 'Utils/general.helpers';
import { ActivityFilterPayload } from 'Models/ActivityValueFilter.model';
import { deFlattenObject } from 'Components/ActivityFiltering/FilterModal/FilterModal.helper';
import { notification } from 'antd';
import { asyncAction } from '../../Utils/actionHelpers';
import { getEnvParams } from '../../configs';
import * as activitiesActionTypes from './activities.actionTypes';

import { ACTIVITIES_TABLE } from 'Constants/tables.constants';

import {
  manuallyOverrideActivityValue,
  revertActivityValueToSubmission,
} from './activities.helpers';
import { getActivityFilterSchemaQuery } from '../../Utils/activities.helpers';
import { TActivity } from 'Types/Activity.type';

const fetchActivitiesForFormFlow = (formId, tableType) => ({
  request: () => ({
    type: activitiesActionTypes.FETCH_ACTIVITIES_FOR_FORM_REQUEST,
    payload: { actionMeta: { formId, origin } },
  }),
  success: (response) => {
    const storeState = (window as any).tePrefsLibStore.getState();
    const sections = storeState.forms[formId].sections;
    return {
      type: activitiesActionTypes.FETCH_ACTIVITIES_FOR_FORM_SUCCESS,
      payload: { ...response, actionMeta: { formId, sections, tableType } },
    };
  },
  failure: (err) => ({
    type: activitiesActionTypes.FETCH_ACTIVITIES_FOR_FORM_FAILURE,
    payload: { ...err, actionMeta: { formId } },
  }),
});

export const fetchActivitiesForForm = (
  formId,
  options,
  tableType = ACTIVITIES_TABLE,
) => {
  const { filters, sorters, pagination = { limit: 10, page: 1 } } = options;
  const sorting = sorters;
  const _filters = deFlattenObject(filters);
  const { settings, status, ...others } = _filters || {};
  return asyncAction.POST({
    flow: fetchActivitiesForFormFlow(formId, tableType),
    endpoint: `${getEnvParams().AM_BE_URL}forms/${formId}/activities/filters`,
    params: {
      filter: isEmptyDeep(others)
        ? undefined
        : new ActivityFilterPayload(others),
      settings: settings,
      sorting: sorting == null ? undefined : sorting,
      schemaQueries: getActivityFilterSchemaQuery({ status }, tableType),
      pagination,
    },
  });
};
const fetchActivitiesForFormInstanceFlow = {
  request: () => ({
    type: activitiesActionTypes.FETCH_ACTIVITIES_FOR_FORM_INSTANCE_REQUEST,
  }),
  success: (response) => ({
    type: activitiesActionTypes.FETCH_ACTIVITIES_FOR_FORM_INSTANCE_SUCCESS,
    payload: { ...response },
  }),
  failure: (err) => ({
    type: activitiesActionTypes.FETCH_ACTIVITIES_FOR_FORM_INSTANCE_FAILURE,
    payload: { ...err },
  }),
};

export const fetchActivitiesForFormInstance = (formId, formInstanceId) =>
  asyncAction.GET({
    flow: fetchActivitiesForFormInstanceFlow,
    endpoint: `${getEnvParams().AM_BE_URL}activity`,
    params: { formInstanceId, formId },
  });

const saveActivitiesFlow = {
  request: () => ({
    type: activitiesActionTypes.SAVE_ACTIVITIES_FOR_FORM_INSTANCE_REQUEST,
  }),
  success: (response) => ({
    type: activitiesActionTypes.SAVE_ACTIVITIES_FOR_FORM_INSTANCE_SUCCESS,
    payload: { ...response },
  }),
  failure: (err) => ({
    type: activitiesActionTypes.SAVE_ACTIVITIES_FOR_FORM_INSTANCE_FAILURE,
    payload: { ...err },
  }),
};

export const saveActivities = (formId, formInstanceId, callback) =>
  asyncAction.POST({
    flow: saveActivitiesFlow,
    endpoint: `${
      getEnvParams().AM_BE_URL
    }activity?formInstanceId=${formInstanceId}`,
    params: {
      formId,
      formInstanceId,
    },
    callback,
  });

const manuallyOverrideActivityValueFlow = {
  request: () => ({
    type: activitiesActionTypes.MANUALLY_OVERRIDE_ACTIVITY_VALUE_REQUEST,
  }),
  success: (response) => ({
    type: activitiesActionTypes.MANUALLY_OVERRIDE_ACTIVITY_VALUE_SUCCESS,
    payload: { ...response },
  }),
  failure: (err) => ({
    type: activitiesActionTypes.MANUALLY_OVERRIDE_ACTIVITY_VALUE_FAILURE,
    payload: { ...err },
  }),
};

export const overrideActivityValue = (newValue, activityValue, activity) => {
  const updatedActivity = manuallyOverrideActivityValue(
    newValue,
    activityValue,
    activity,
  );
  return asyncAction.PUT({
    flow: manuallyOverrideActivityValueFlow,
    endpoint: `${getEnvParams().AM_BE_URL}activity/${activity._id}`,
    params: {
      activity: updatedActivity,
    },
  });
};

const revertToSubmissionValueFlow = {
  request: () => ({
    type: activitiesActionTypes.REVERT_TO_SUBMISSION_VALUE_REQUEST,
  }),
  success: (response) => ({
    type: activitiesActionTypes.REVERT_TO_SUBMISSION_VALUE_SUCCESS,
    payload: { ...response },
  }),
  failure: (err) => ({
    type: activitiesActionTypes.REVERT_TO_SUBMISSION_VALUE_FAILURE,
    payload: { ...err },
  }),
};

export const revertToSubmissionValue = (activityValue, activity) => {
  const updatedActivity = revertActivityValueToSubmission(
    activityValue,
    activity,
  );
  return asyncAction.PUT({
    flow: revertToSubmissionValueFlow,
    endpoint: `${getEnvParams().AM_BE_URL}activity/${activity._id}`,
    params: {
      activity: updatedActivity,
    },
  });
};

const deleteActivitiesFlow = {
  request: () => ({
    type: activitiesActionTypes.DELETE_ACTIVITIES_FOR_FORM_REQUEST,
  }),
  success: (response) => ({
    type: activitiesActionTypes.DELETE_ACTIVITIES_FOR_FORM_SUCCESS,
    payload: { ...response },
  }),
  failure: (err) => ({
    type: activitiesActionTypes.DELETE_ACTIVITIES_FOR_FORM_FAILURE,
    payload: { ...err },
  }),
};

export const deleteActivities = (formId) =>
  asyncAction.DELETE({
    flow: deleteActivitiesFlow,
    endpoint: `${getEnvParams().AM_BE_URL}activity?formId=${formId}`,
    params: { formId },
  });

const deleteActivitiesInFormInstanceFlow = {
  request: () => ({
    type: activitiesActionTypes.DELETE_ACTIVITIES_FOR_FORM_INSTANCE_REQUEST,
  }),
  success: (response) => ({
    type: activitiesActionTypes.DELETE_ACTIVITIES_FOR_FORM_INSTANCE_SUCCESS,
    payload: { ...response },
  }),
  failure: (err) => ({
    type: activitiesActionTypes.DELETE_ACTIVITIES_FOR_FORM_INSTANCE_FAILURE,
    payload: { ...err },
  }),
};

export const deleteActivitiesInFormInstance = (formId, formInstanceId) =>
  asyncAction.DELETE({
    flow: deleteActivitiesInFormInstanceFlow,
    endpoint: `${
      getEnvParams().AM_BE_URL
    }activity?formInstanceId=${formInstanceId}`,
    params: { formId, formInstanceId },
  });

const updateActivityFlow = {
  request: () => ({ type: activitiesActionTypes.UPDATE_ACTIVITY_REQUEST }),
  success: (response) => ({
    type: activitiesActionTypes.UPDATE_ACTIVITY_SUCCESS,
    payload: { ...response },
  }),
  failure: (err) => ({
    type: activitiesActionTypes.UPDATE_ACTIVITY_FAILURE,
    payload: { ...err },
  }),
};

export const updateActivity = (activity) =>
  asyncAction.PUT({
    flow: updateActivityFlow,
    endpoint: `${getEnvParams().AM_BE_URL}activity/${activity._id}`,
    params: { activity },
  });

const updateActivitiesFlow = (activities) => ({
  request: () => ({
    type: activitiesActionTypes.UPDATE_ACTIVITIES_REQUEST,
    payload: { activities },
  }),
  success: (response) => ({
    type: activitiesActionTypes.UPDATE_ACTIVITIES_SUCCESS,
    payload: { ...response },
  }),
  failure: (err) => ({
    type: activitiesActionTypes.UPDATE_ACTIVITIES_FAILURE,
    payload: { ...err, activities },
  }),
});

export const updateActivities = (formId, formInstanceId, activities) =>
  asyncAction.PUT({
    flow: updateActivitiesFlow(activities),
    endpoint: `${getEnvParams().AM_BE_URL}activity`,
    params: {
      formId,
      formInstanceId,
      activities,
    },
    isParallel: true,
  });

export const setSchedulingStatusOfActivitiesFlow = {
  request: () => ({
    type: activitiesActionTypes.SET_SCHEDULING_STATUS_OF_ACTIVITIES_REQUEST,
  }),
  success: (response) => ({
    type: activitiesActionTypes.SET_SCHEDULING_STATUS_OF_ACTIVITIES_SUCCESS,
    payload: { ...response },
  }),
  failure: (err) => ({
    type: activitiesActionTypes.SET_SCHEDULING_STATUS_OF_ACTIVITIES_FAILURE,
    payload: { ...err },
  }),
};

export const setSchedulingStatusOfActivities = (formId, schedulingStatuses) =>
  asyncAction.POST({
    flow: setSchedulingStatusOfActivitiesFlow,
    endpoint: `${
      getEnvParams().AM_BE_URL
    }forms/${formId}/activities/scheduling-status`,
    params: {
      schedulingStatuses,
    },
  });

const reorderActivitiesFlow = {
  request: ({ formId, formInstanceId, sourceIdx, destinationIdx }) => ({
    type: activitiesActionTypes.REORDER_ACTIVITIES_REQUEST,
    payload: { formId, formInstanceId, sourceIdx, destinationIdx },
  }),
  success: (response) => ({
    type: activitiesActionTypes.REORDER_ACTIVITIES_SUCCESS,
    payload: { ...response },
  }),
  failure: (err) => ({
    type: activitiesActionTypes.REORDER_ACTIVITIES_FAILURE,
    payload: { ...err },
  }),
};

export const reorderActivities = (
  formId,
  formInstanceId,
  sourceIdx,
  destinationIdx,
) =>
  asyncAction.PUT({
    flow: reorderActivitiesFlow,
    endpoint: `${
      getEnvParams().AM_BE_URL
    }activity/form-instances/${formInstanceId}`,
    params: {
      formId,
      formInstanceId,
      sourceIdx,
      destinationIdx,
    },
  });

const createActivityFlow = {
  request: () => ({ type: activitiesActionTypes.CREATE_ACTIVITY_REQUEST }),
  failure: (err) => ({
    type: activitiesActionTypes.CREATE_ACTIVITY_FAILURE,
    payload: err,
  }),
  success: (response) => {
    notification.success({
      getContainer: () =>
        document.getElementById('te-prefs-lib') as HTMLElement,
      message: 'Activities merged',
      description: 'Successfully merged the activities!',
    });

    return {
      type: activitiesActionTypes.CREATE_ACTIVITY_SUCCESS,
      payload: response,
    };
  },
};

export const createActivity = ({ formId, activity }) =>
  asyncAction.POST({
    flow: createActivityFlow,
    endpoint: `${getEnvParams().AM_BE_URL}forms/${formId}/activities`,
    params: activity,
  });

const getSelectedActivitiesFlow = (
  callback: (activities: TActivity[]) => void,
) => ({
  request: () => ({
    type: activitiesActionTypes.GET_SELECTED_ACTIVITIES_REQUEST,
  }),
  failure: (err) => ({
    type: activitiesActionTypes.GET_SELECTED_ACTIVITIES_FAILURE,
    payload: err,
  }),
  success: (response: { activities: TActivity[] }) => {
    // TODO: Test this!
    callback(response.activities);
    return {
      type: activitiesActionTypes.GET_SELECTED_ACTIVITIES_SUCCESS,
      payload: response,
    };
  },
});

export const getSelectedActivities = ({
  selectedActivityIds,
  formId,
  callback,
}: {
  selectedActivityIds: string[];
  formId: string;
  callback(selectedActivities: TActivity[]): void;
}) => {
  return asyncAction.GET({
    flow: getSelectedActivitiesFlow(callback),
    endpoint: `${getEnvParams().AM_BE_URL}forms/${formId}/activities`,
    params: { activityIds: selectedActivityIds },
  });
};

export const updateActivityInWorkerProgress = ({ formId }) => ({
  type: activitiesActionTypes.UPDATE_ACTIVITY_IN_WORKER_PROGRESS,
  payload: { formId },
});

const fetchActivityInWorkerProgressFlow = {
  request: () => ({
    type: activitiesActionTypes.GET_ACTIVITIES_IN_WORKER_PROGRESS_REQUEST,
  }),
  success: (response) => ({
    type: activitiesActionTypes.GET_ACTIVITIES_IN_WORKER_PROGRESS_SUCCESS,
    payload: { ...response },
  }),
  failure: (err) => ({
    type: activitiesActionTypes.GET_ACTIVITIES_IN_WORKER_PROGRESS_FAILURE,
    payload: { ...err },
  }),
};

export const fetchActivityInWorkerProgress = (formId) =>
  asyncAction.GET({
    flow: fetchActivityInWorkerProgressFlow,
    endpoint: `${
      getEnvParams().AM_BE_URL
    }forms/${formId}/activities/worker-progress`,
  });
