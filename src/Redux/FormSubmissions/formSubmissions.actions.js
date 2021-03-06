import { asyncAction } from '../../Utils/actionHelpers';
import {
  FETCH_SUBMISSIONS_FOR_FORM_REQUEST,
  FETCH_SUBMISSIONS_FOR_FORM_SUCCESS,
  FETCH_SUBMISSIONS_FOR_FORM_FAILURE,
  SET_FORM_INSTANCE_ACCEPTANCE_STATUS_REQUEST,
  SET_FORM_INSTANCE_ACCEPTANCE_STATUS_SUCCESS,
  SET_FORM_INSTANCE_ACCEPTANCE_STATUS_FAILURE,
  SET_SCHEDULING_PROGRESS_REQUEST,
  SET_SCHEDULING_PROGRESS_SUCCESS,
  SET_SCHEDULING_PROGRESS_FAILURE,
  ASSIGN_USER_TO_FORM_INSTANCE_REQUEST,
  ASSIGN_USER_TO_FORM_INSTANCE_SUCCESS,
  ASSIGN_USER_TO_FORM_INSTANCE_FAILURE,
  UPDATE_SELECTION_SETTINGS_REQUEST,
  UPDATE_SELECTION_SETTINGS_SUCCESS,
  UPDATE_SELECTION_SETTINGS_FAILURE,
  SEND_REVIEWER_LINK_REQUEST,
  SEND_REVIEWER_LINK_SUCCESS,
  SEND_REVIEWER_LINK_FAILURE,
} from './formSubmissions.actionTypes';

const fetchFormSubmissionsFlow = {
  request: () => ({ type: FETCH_SUBMISSIONS_FOR_FORM_REQUEST }),
  success: (response) => ({
    type: FETCH_SUBMISSIONS_FOR_FORM_SUCCESS,
    payload: { ...response },
  }),
  failure: (err) => ({
    type: FETCH_SUBMISSIONS_FOR_FORM_FAILURE,
    payload: { ...err },
  }),
};

export const fetchFormSubmissions = (formId, query) =>
  asyncAction.GET({
    flow: fetchFormSubmissionsFlow,
    endpoint: `forms/${formId}/submissions`,
    params: query,
  });

const setFormInstanceAcceptanceStatusFlow = {
  request: () => ({ type: SET_FORM_INSTANCE_ACCEPTANCE_STATUS_REQUEST }),
  success: (response) => ({
    type: SET_FORM_INSTANCE_ACCEPTANCE_STATUS_SUCCESS,
    payload: { ...response },
  }),
  failure: (err) => ({
    type: SET_FORM_INSTANCE_ACCEPTANCE_STATUS_FAILURE,
    payload: { ...err },
  }),
};

export const setFormInstanceAcceptanceStatus = ({
  formInstanceId,
  acceptanceStatus,
  acceptanceComment,
}) =>
  asyncAction.PUT({
    flow: setFormInstanceAcceptanceStatusFlow,
    endpoint: `form-instances/${formInstanceId}/te-core/acceptance-status`,
    params: { acceptanceStatus, acceptanceComment },
  });

const setFormInstanceSchedulingProgressFlow = {
  request: () => ({ type: SET_SCHEDULING_PROGRESS_REQUEST }),
  success: (response) => ({
    type: SET_SCHEDULING_PROGRESS_SUCCESS,
    payload: { ...response },
  }),
  failure: (err) => ({
    type: SET_SCHEDULING_PROGRESS_FAILURE,
    payload: { ...err },
  }),
};

export const setFormInstanceSchedulingProgress = ({
  formInstanceId,
  schedulingProgress,
}) =>
  asyncAction.PUT({
    flow: setFormInstanceSchedulingProgressFlow,
    endpoint: `form-instances/${formInstanceId}/te-core/scheduling-progress`,
    params: { schedulingProgress },
  });

const toggleFormInstanceStarringStatusFlow = {
  request: () => ({ type: SET_SCHEDULING_PROGRESS_REQUEST }),
  success: (response) => ({
    type: SET_SCHEDULING_PROGRESS_SUCCESS,
    payload: { ...response },
  }),
  failure: (err) => ({
    type: SET_SCHEDULING_PROGRESS_FAILURE,
    payload: { ...err },
  }),
};

export const toggleFormInstanceStarringStatus = ({
  formInstanceId,
  isStarred,
}) =>
  asyncAction.POST({
    flow: toggleFormInstanceStarringStatusFlow,
    endpoint: `form-instances/${formInstanceId}/te-core/${
      isStarred ? 'unstar' : 'star'
    }`,
  });

const toggleUserForFormInstanceFlow = {
  request: () => ({ type: ASSIGN_USER_TO_FORM_INSTANCE_REQUEST }),
  success: (response) => ({
    type: ASSIGN_USER_TO_FORM_INSTANCE_SUCCESS,
    payload: { ...response },
  }),
  failure: (err) => ({
    type: ASSIGN_USER_TO_FORM_INSTANCE_FAILURE,
    payload: { ...err },
  }),
};

export const toggleUserForFormInstance = ({ formInstanceId, userId }) =>
  asyncAction.PUT({
    flow: toggleUserForFormInstanceFlow,
    endpoint: `form-instances/${formInstanceId}/te-core/assign`,
    params: { userId },
  });

const updateSelectionSettingsFlow = {
  request: () => ({ type: UPDATE_SELECTION_SETTINGS_REQUEST }),
  success: (response) => ({
    type: UPDATE_SELECTION_SETTINGS_SUCCESS,
    payload: { ...response },
  }),
  failure: (err) => ({
    type: UPDATE_SELECTION_SETTINGS_FAILURE,
    payload: { ...err },
  }),
};

export const updateSelectionSettings = ({
  formId,
  formInstanceId,
  sectionId,
  selectionSettings,
}) =>
  asyncAction.PUT({
    flow: updateSelectionSettingsFlow,
    endpoint: `form-instances/${formInstanceId}/te-core/selection-settings`,
    params: {
      formId,
      formInstanceId,
      sectionId,
      selectionSettings,
    },
  });

const sendReviewerLinkFlow = {
  request: () => ({ type: SEND_REVIEWER_LINK_REQUEST }),
  success: (response) => ({
    type: SEND_REVIEWER_LINK_SUCCESS,
    payload: { ...response },
  }),
  failure: (err) => ({
    type: SEND_REVIEWER_LINK_FAILURE,
    payload: { ...err },
  }),
};

export const sendReviewerLink = ({ formInstanceIds }) =>
  asyncAction.POST({
    flow: sendReviewerLinkFlow,
    endpoint: 'form-instances/notify/viewer-link',
    params: {
      formInstanceIds,
    },
    successNotification: 'The review link has been sent to user(s)',
  });
