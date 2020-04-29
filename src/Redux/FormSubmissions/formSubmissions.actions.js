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
} from './formSubmissions.actionTypes';

const fetchFormSubmissionsFlow = {
  request: () => ({ type: FETCH_SUBMISSIONS_FOR_FORM_REQUEST }),
  success: response => ({
    type: FETCH_SUBMISSIONS_FOR_FORM_SUCCESS,
    payload: { ...response }
  }),
  failure: err => ({
    type: FETCH_SUBMISSIONS_FOR_FORM_FAILURE,
    payload: { ...err }
  })
};

export const fetchFormSubmissions = formId =>
  asyncAction.GET({
    flow: fetchFormSubmissionsFlow,
    endpoint: `forms/${formId}/submissions`
  });

const setFormInstanceAcceptanceStatusFlow = {
  request: () => ({ type: SET_FORM_INSTANCE_ACCEPTANCE_STATUS_REQUEST }),
  success: response => ({
    type: SET_FORM_INSTANCE_ACCEPTANCE_STATUS_SUCCESS,
    payload: { ...response }
  }),
  failure: err => ({
    type: SET_FORM_INSTANCE_ACCEPTANCE_STATUS_FAILURE,
    payload: { ...err }
  })
};

export const setFormInstanceAcceptanceStatus = ({
  formInstanceId,
  acceptanceStatus,
  acceptanceComment
}) =>
  asyncAction.PUT({
    flow: setFormInstanceAcceptanceStatusFlow,
    endpoint: `form-instances/${formInstanceId}/te-core/acceptance-status`,
    params: { acceptanceStatus, acceptanceComment }
  });

const setFormInstanceSchedulingProgressFlow = {
  request: () => ({ type: SET_SCHEDULING_PROGRESS_REQUEST }),
  success: response => ({
    type: SET_SCHEDULING_PROGRESS_SUCCESS,
    payload: { ...response }
  }),
  failure: err => ({
    type: SET_SCHEDULING_PROGRESS_FAILURE,
    payload: { ...err }
  })
};

export const setFormInstanceSchedulingProgress = ({
  formInstanceId,
  schedulingProgress
}) =>
  asyncAction.PUT({
    flow: setFormInstanceSchedulingProgressFlow,
    endpoint: `form-instances/${formInstanceId}/te-core/scheduling-progress`,
    params: { schedulingProgress }
  });
