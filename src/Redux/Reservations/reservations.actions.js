/* eslint-disable no-unused-vars */
import { asyncAction } from '../../Utils/actionHelpers';
import {
  FETCH_RESERVATIONS_FOR_FORM_REQUEST,
  FETCH_RESERVATIONS_FOR_FORM_SUCCESS,
  FETCH_RESERVATIONS_FOR_FORM_FAILURE,
  FETCH_RESERVATIONS_FOR_FORM_INSTANCE_REQUEST,
  FETCH_RESERVATIONS_FOR_FORM_INSTANCE_SUCCESS,
  FETCH_RESERVATIONS_FOR_FORM_INSTANCE_FAILURE,
  SAVE_RESERVATIONS_FOR_FORM_INSTANCE_REQUEST,
  SAVE_RESERVATIONS_FOR_FORM_INSTANCE_SUCCESS,
  SAVE_RESERVATIONS_FOR_FORM_INSTANCE_FAILURE,
  DELETE_RESERVATIONS_FOR_FORM_REQUEST,
  DELETE_RESERVATIONS_FOR_FORM_SUCCESS,
  DELETE_RESERVATIONS_FOR_FORM_FAILURE,
  MANUALLY_OVERRIDE_RESERVATION_VALUE_REQUEST,
  MANUALLY_OVERRIDE_RESERVATION_VALUE_SUCCESS,
  MANUALLY_OVERRIDE_RESERVATION_VALUE_FAILURE,
  SCHEDULE_RESERVATION_REQUEST,
  SCHEDULE_RESERVATION_SUCCESS,
  SCHEDULE_RESERVATION_FAILURE,
  SCHEDULE_RESERVATIONS_REQUEST,
  SCHEDULE_RESERVATIONS_SUCCESS,
  SCHEDULE_RESERVATIONS_FAILURE,
  REVERT_TO_SUBMISSION_VALUE_REQUEST,
  REVERT_TO_SUBMISSION_VALUE_SUCCESS,
  REVERT_TO_SUBMISSION_VALUE_FAILURE,
} from './reservations.actionTypes';

import { manuallyOverrideReservationValue, revertReservationValueToSubmission } from './reservations.helpers';

const fetchReservationsForFormFlow = {
  request: () => ({ type: FETCH_RESERVATIONS_FOR_FORM_REQUEST }),
  success: response => ({ type: FETCH_RESERVATIONS_FOR_FORM_SUCCESS, payload: { ...response } }),
  failure: err => ({ type: FETCH_RESERVATIONS_FOR_FORM_FAILURE, payload: { ...err } }),
};

export const fetchReservationsForForm = formId =>
  asyncAction.GET({
    flow: fetchReservationsForFormFlow,
    endpoint: `forms/${formId}/reservations`,
    params: { formId },
  });

const fetchReservationsForFormInstanceFlow = {
  request: () => ({ type: FETCH_RESERVATIONS_FOR_FORM_INSTANCE_REQUEST }),
  success: response => ({ type: FETCH_RESERVATIONS_FOR_FORM_INSTANCE_SUCCESS, payload: { ...response } }),
  failure: err => ({ type: FETCH_RESERVATIONS_FOR_FORM_INSTANCE_FAILURE, payload: { ...err } }),
};

export const fetchReservationsForFormInstance = (formId, formInstanceId) =>
  asyncAction.GET({
    flow: fetchReservationsForFormInstanceFlow,
    endpoint: `form-instances/${formInstanceId}/reservations`,
    params: { formInstanceId, formId },
  });

const saveReservationsFlow = {
  request: () => ({ type: SAVE_RESERVATIONS_FOR_FORM_INSTANCE_REQUEST }),
  success: response => ({ type: SAVE_RESERVATIONS_FOR_FORM_INSTANCE_SUCCESS, payload: { ...response } }),
  failure: err => ({ type: SAVE_RESERVATIONS_FOR_FORM_INSTANCE_FAILURE, payload: { ...err } }),
};

export const saveReservations = (formId, formInstanceId, reservations) =>
  asyncAction.POST({
    flow: saveReservationsFlow,
    endpoint: `form-instances/${formInstanceId}/reservations`,
    params: {
      formId,
      formInstanceId,
      reservations,
    },
  });

const manuallyOverrideReservationValueFlow = {
  request: () => ({ type: MANUALLY_OVERRIDE_RESERVATION_VALUE_REQUEST }),
  success: response => ({ type: MANUALLY_OVERRIDE_RESERVATION_VALUE_SUCCESS, payload: { ...response } }),
  failure: err => ({ type: MANUALLY_OVERRIDE_RESERVATION_VALUE_FAILURE, payload: { ...err } }),
};

export const overrideReservationValue = (newValue, reservationValue, reservation) => {
  const updatedReservation = manuallyOverrideReservationValue(newValue, reservationValue, reservation);
  return asyncAction.PUT({
    flow: manuallyOverrideReservationValueFlow,
    endpoint: `form-instances/${reservation.formInstanceId}/reservations/${reservation._id}`,
    params: {
      reservation: updatedReservation,
    },
  });
};

const revertToSubmissionValueFlow = {
  request: () => ({ type: REVERT_TO_SUBMISSION_VALUE_REQUEST }),
  success: response => ({ type: REVERT_TO_SUBMISSION_VALUE_SUCCESS, payload: { ...response } }),
  failure: err => ({ type: REVERT_TO_SUBMISSION_VALUE_FAILURE, payload: { ...err } }),
};

export const revertToSubmissionValue = (reservationValue, reservation) => {
  const updatedReservation = revertReservationValueToSubmission(reservationValue, reservation);
  return asyncAction.PUT({
    flow: revertToSubmissionValueFlow,
    endpoint: `form-instances/${reservation.formInstanceId}/reservations/${reservation._id}`,
    params: {
      reservation: updatedReservation,
    },
  });
}

const deleteReservationsFlow = {
  request: () => ({ type: DELETE_RESERVATIONS_FOR_FORM_REQUEST }),
  success: response => ({ type: DELETE_RESERVATIONS_FOR_FORM_SUCCESS, payload: { ...response } }),
  failure: err => ({ type: DELETE_RESERVATIONS_FOR_FORM_FAILURE, payload: { ...err } }),
};

export const deleteReservations = formId =>
  asyncAction.DELETE({
    flow: deleteReservationsFlow,
    endpoint: `forms/${formId}/reservations`,
    params: { formId }
  });

export const scheduleReservation = ({ api, reservation }) => (dispatch, getState) => {
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
