import { asyncAction } from '../../Utils/actionHelpers';
import {
  FETCH_FORMS_REQUEST,
  FETCH_FORMS_SUCCESS,
  FETCH_FORMS_FAILURE
} from './forms.actionTypes';

const fetchFormsFlow = {
  request: () => ({ type: FETCH_FORMS_REQUEST }),
  success: response => ({ type: FETCH_FORMS_SUCCESS, payload: { ...response } }),
  failure: err => ({ type: FETCH_FORMS_FAILURE, payload: { ...err } }),
}

export const fetchForms = () =>
  asyncAction.GET({
    flow: fetchFormsFlow,
    endpoint: 'forms',
    requiresAuth: true,
  });
