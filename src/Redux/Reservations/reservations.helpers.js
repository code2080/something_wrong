import _ from 'lodash';
import moment from 'moment';
import { reservationValueModes, reservationValueModeProps } from '../../Constants/reservationValueModes.constants';
import { submissionValueTypes, submissionValueTypeProps } from '../../Constants/submissionValueTypes.constants';
import { mappingTimingModes } from '../../Constants/mappingTimingModes.constants';
import { reservationValueStatuses, reservationValueStatusProps } from '../../Constants/reservationStatuses.constants';
import { mappingTypes } from '../../Constants/mappingTypes.constants';
import { schedulingAlgorithms, schedulingAlgorithmProps } from '../../Constants/schedulingAlgorithms.constants';
/**
 * @function getReservationForEvent
 * @description picks the reservation corresponding to a specific event from a connected section
 * @param {Object} state a redux state object
 * @param {String} formId the form Id
 * @param {String} formInstanceId the form instance id
 * @param {String} sectionId the section id
 * @param {String} eventId the event id
 * @returns {Object} reservation corresponding to the event
 */
export const getReservationForEvent = (state, formId, formInstanceId, sectionId, eventId) => {
  if (!state || !formId || !formInstanceId || !sectionId || !eventId) return [];
  const reservations = _.get(state, `[${formId}][${formInstanceId}]`, []);
  return reservations.find(el => el.sectionId === sectionId && el.eventId === eventId);
};

/**
 * @function getReservationsForFormInstance
 * @description selects all the reservations for a form instance
 * @param {Object} state a redux state object
 * @param {String} formId the form id
 * @param {String} formInstanceId the form instance id
 * @returns {Array} all reservations for a form instance
 */
export const getReservationsForFormInstance = (state, formId, formInstanceId) => {
  if (!state || !formId || !formInstanceId) return [];
  return _.get(state, `[${formId}][${formInstanceId}]`, []);
};

/**
 * @function findObjectPathForReservationValue
 * @description finds the path (timing or values) for a value for a certain extId
 * @param {String} valueExtId the extId of the value we're looking for
 * @param {Object} reservation the reservation with all its values
 * @returns {String} values || timing
 */
const findObjectPathForReservationValue = (valueExtId, reservation) => {
  const timingIdx = reservation.timing.findIndex(el => el.extId === valueExtId);
  if (timingIdx > -1) return 'timing';
  const valueIdx = reservation.values.findIndex(el => el.extId === valueExtId);
  if (valueIdx > -1) return 'values';
  return null;
};

/**
 * @function updateReservationWithNewValue
 * @description returns a new reservation with an updated reservation value
 * @param {Object} newReservationValue the new reservation value object
 * @param {Object} reservation the original reservation
 * @param {String} objPath the path to mutate (timing, values)
 * @returns {Object} updated reservation
 */
const updateReservationWithNewValue = (newReservationValue, reservation, objPath) => {
  const valueIdx = reservation[objPath].findIndex(el => el.extId === newReservationValue.extId);
  if (valueIdx === -1) return null;
  return {
    ...reservation,
    [objPath]: [
      ...reservation[objPath].slice(0, valueIdx),
      { ...newReservationValue },
      ...reservation[objPath].slice(valueIdx + 1),
    ],
  };
};

/**
 * @function manuallyOverrideReservationValue
 * @description return a new reservation value with a manually overriden value param
 * @param {String || Number} newValue the new value
 * @param {Object} reservationValue the original reservation value
 * @param {Object} reservation the original reservation on which the reservation value resides
 * @returns {Object} updated reservation
 */
export const manuallyOverrideReservationValue = (newValue, reservationValue, reservation) => {
  const newReservationValue = { ...reservationValue, value: newValue, valueMode: reservationValueModes.MANUAL };
  const objPath = findObjectPathForReservationValue(newReservationValue.extId, reservation);
  if (!objPath) return null;
  return updateReservationWithNewValue(newReservationValue, reservation, objPath);
};

/**
 * @function revertReservationValueToSubmission
 * @description reverts a manually overriden reservation to its orginal submission value
 * @param {Object} reservationValue the reservationValue to be reverted
 * @param {Object} reservation the reservation on which the reservationValue resides
 * @returns {Object} updated reservation
 */
export const revertReservationValueToSubmission = (reservationValue, reservation) => {
  /**
   * @logic
   * valueMode: FROM_SUBMISSION
   * value should then be reverted to:
   *  if submissionValueType === OBJECT || FREE_TEXT => set to submissionValue[0]
   *  if submissionValueType === FILTER => set to null
   *  if submissionValueType === TIMING && timingMode === EXACT => set to submissionValue[0]
   *  if submissionValueType === TIMING && timingMode === TIMESLOTS
   *    if extId === LENGTH => set to submissionValue[0]
   *    if extId === startTime || endTime => set to null
   */
  const { submissionValueType, submissionValue } = reservationValue;
  const timingMode = reservation.timing.find(el => el.extId === 'mode');
  let newReservationValue;
  if (
    submissionValueType === submissionValueTypes.OBJECT ||
    submissionValueType === submissionValueTypes.FREE_TEXT ||
    (submissionValueType === submissionValueTypes.TIMING && timingMode === mappingTimingModes.EXACT) ||
    reservationValue.extId === 'length'
  ) {
    newReservationValue = {
      ...reservationValue,
      valueMode: reservationValueModes.FROM_SUBMISSION,
      value: submissionValue[0],
    };
  } else {
    newReservationValue = {
      ...reservationValue,
      valueMode: reservationValueModes.FROM_SUBMISSION,
      value: null,
    };
  }

  const objPath = findObjectPathForReservationValue(newReservationValue.extId, reservation);
  if (!objPath) return null;
  // 3. Update the reservation and return
  return updateReservationWithNewValue(newReservationValue, reservation, objPath);
};

/**
 * @function createSchedulingValuePayload
 * @description creates a standardized scheduling payload for a reservation value
 * @param {String} status MISSING_DATA || READY_FOR_SCHEDULING
 * @param {String} rawValue the raw value to use for scheduling
 * @param {String} formattedValue any formatted value that might be better for presentation
 * @param {String} tooltip tooltip title to show on hover
 * @param {String} icon the icon type to use
 * @returns {Object} schedulingValuePayload
 */
const createSchedulingValuePayload = ({ status, rawValue, formattedValue, errorMessage }) => ({
  status,
  rawValue: status === reservationValueStatuses.MISSING_DATA
    ? reservationValueStatusProps[reservationValueStatuses.MISSING_DATA].label
    : rawValue,
  formattedValue: status === reservationValueStatuses.MISSING_DATA
    ? reservationValueStatusProps[reservationValueStatuses.MISSING_DATA].label
    : formattedValue,
  errorMessage: errorMessage ||
    (status === reservationValueStatuses.MISSING_DATA
      ? reservationValueStatusProps[reservationValueStatuses.MISSING_DATA].tooltip
      : null),
});

/**
 * @function getSchedulingPayloadForTimeSlotStartTime
 * @description extracts and validates the values for start time with timeslots
 * @param {Object} reservationValue the reservationValue
 * @param {Object} timingValues all timing values
 * @returns {Object} schedulingValuePayload
 */

const getSchedulingPayloadForTimeSlotStartTime = (reservationValue, timingValues) => {
  if (!reservationValue.submissionValue[0])
    return createSchedulingValuePayload({
      status: reservationValueStatuses.MISSING_DATA,
      errorMessage: 'Start time is missing, please input the value manually to calculate a start time range'
    });

  const _length = timingValues.find(el => el.extId === 'length');
  const _endTime = timingValues.find(el => el.extId === 'endTime');
  if (!_length || !_endTime || !_length.value || !_endTime.submissionValue[0])
    return createSchedulingValuePayload({
      status: reservationValueStatuses.MISSING_DATA,
      errorMessage: 'End time or length is missing, please input these values manually to calculate a start time range'
    });

  const startTime = reservationValue.submissionValue[0];
  const length = _length.value;
  const endTime = _endTime.submissionValue[0];

  return createSchedulingValuePayload({
    status: reservationValueStatuses.READY_FOR_SCHEDULING,
    value: [startTime, moment(endTime).subtract(length, 'hours')],
    formattedValue: `${moment(startTime).format('YYYY-MM-DD')} ${moment(startTime).format('HH:mm')} - ${moment(endTime).subtract(length, 'hours').format('HH:mm')}`,
  });
};

/**
 * @function getSchedulingPayloadForTimeSlotEndTime
 * @description extracts and validates the values for end time with timeslots
 * @param {Object} reservationValue the reservationValue
 * @param {Object} timingValues all timing values
 * @returns {Object} schedulingValuePayload
 */
const getSchedulingPayloadForTimeSlotEndTime = (reservationValue, timingValues) => {
  if (!reservationValue.submissionValue[0])
    return createSchedulingValuePayload({
      status: reservationValueStatuses.MISSING_DATA,
      errorMessage: 'End time is missing, please input the value manually to calculate an end time range',
    });

  const _length = timingValues.find(el => el.extId === 'length');
  const _startTime = timingValues.find(el => el.extId === 'startTime');
  if (!_length || !_startTime || !_length.value || !_startTime.submissionValue[0])
    return createSchedulingValuePayload({
      status: reservationValueStatuses.MISSING_DATA,
      errorMessage: 'Start time or length is missing, please input these values manually to calculate a start time range',
    });

  const endTime = reservationValue.submissionValue[0];
  const length = _length.value;
  const startTime = _startTime.submissionValue[0];
  return createSchedulingValuePayload({
    status: reservationValueStatuses.READY_FOR_SCHEDULING,
    value: [moment(startTime).add(length, 'hours'), moment(endTime)],
    formattedValue: `${moment(startTime).format('YYYY-MM-DD')} ${moment(startTime).add(length, 'hours').format('HH:mm')} - ${moment(endTime).format('HH:mm')}`,
  });
};

/**
 * @function getSchedulingPayloadForObjectFilter
 * @param {Object} reservationValue the reservation value
 * @returns {Object} schedulingValuePayload
 */
const getSchedulingPayloadForObjectFilter = reservationValue => {
  if (reservationValue.value)
    return createSchedulingValuePayload({
      status: reservationValueStatuses.READY_FOR_SCHEDULING,
      value: reservationValue.value,
      formattedValue: reservationValue.value,
    });
  if (
    !reservationValue.submissionValue[0] ||
    !reservationValue.submissionValue[0].value ||
    !reservationValue.submissionValue[0].value[0]
  )
    return createSchedulingValuePayload({
      status: reservationValueStatuses.MISSING_DATA,
    });
  return createSchedulingValuePayload({
    status: reservationValueStatuses.READY_FOR_SCHEDULING,
    value: reservationValue.submissionValue,
    formattedValue: reservationValue.submissionValue.map(el => `Field: ${el.field}, value: ${el.value[0]}`).toString(),
  });
};

const addExtrasToReservationValue = (reservationValue, mappingType) => {
  // If manual, always return manual
  if (reservationValue.valueMode === reservationValueModes.MANUAL)
    return { icon: reservationValueModeProps[reservationValueModes.MANUAL].icon, tooltip: 'The value was entered manually by the user' };
  // If from submission, we need to check if it's a filer or not
  if (reservationValue.submissionValueType === submissionValueTypes.FILTER)
    return { icon: submissionValueTypeProps[submissionValueTypes.FILTER].icon, tooltip: 'The object filter values are from the submission' };
  // Else, if it's a timing property and we DON'T have a value
  if (mappingType === mappingTypes.TIMING && !reservationValue.value)
    return { icon: 'column-height', tooltip: 'The timing range is based on the submission' };
  // Else, return from submission
  return { icon: reservationValueModeProps[reservationValueModes.FROM_SUBMISSION].icon, tooltip: 'The value is from the submission' };
};

/**
 * @function getReservationValueForScheduling
 * @description calculates the value from a reservation value that should be used in scheduling
 * @param {Object} reservationValue the reservation value
 * @param {Object} reservation the reservation on which the reservation value resides
 * @param {Func} formatFn if any specific formatting should be applied to the value for display
 * @param {Bool} addExtras if return should be augmented with tooltips and icon
 * @param {String} mappingType the type of mapping (field, object, timing) - required for addExtras
 */
export const getSchedulingPayloadForReservationValue = (
  reservationValue,
  reservation,
  formatFn = val => val,
  addExtras = false,
  mappingType = null
) => {
  let retVal = null;
  const timingMode = reservation.timing.find(el => el.extId === 'mode');
  // Special case: start time and time slots
  if (reservationValue.extId === 'startTime' && timingMode.value === mappingTimingModes.TIMESLOTS)
    retVal = getSchedulingPayloadForTimeSlotStartTime(reservationValue, reservation.timing);
  // Special case: end time and time slots
  if (reservationValue.extId === 'endTime' && timingMode.value === mappingTimingModes.TIMESLOTS)
    retVal = getSchedulingPayloadForTimeSlotEndTime(reservationValue, reservation.timing);
  // Special case: filters
  if (reservationValue.submissionValueType === submissionValueTypes.FILTER)
    retVal = getSchedulingPayloadForObjectFilter(reservationValue);
  // General case
  if (!retVal)
    retVal = createSchedulingValuePayload({
      status: reservationValue.value ? reservationValueStatuses.READY_FOR_SCHEDULING : reservationValueStatuses.MISSING_DATA,
      value: reservationValue.value ? reservationValue.value : null,
      formattedValue: reservationValue.value ? formatFn(reservationValue.value) : null,
    });

  if (addExtras && mappingType)
    return {
      ...retVal,
      ...addExtrasToReservationValue(reservationValue, mappingType)
    };

  return retVal;
};

const createSchedulingAlgorithmPayload = schedulingAlgorithm => ({
  schedulingAlgorithm: schedulingAlgorithm,
  ...schedulingAlgorithmProps[schedulingAlgorithm],
});

/**
 * @function getSchedulingAlgorithmForReservationValue
 * @description assert which algorithm that should be used for scheduling the reservation value
 * @param {Object} reservationValue the reservation value to be asserted
 * @param {String} mappingType the prop type it's mapped to
 */
export const getSchedulingAlgorithmForReservationValue = (reservationValue, mappingType) => {
  if (reservationValue.valueMode === reservationValueModes.MANUAL)
    return createSchedulingAlgorithmPayload(schedulingAlgorithms.EXACT);
  if (mappingType === mappingTypes.TIMING && !reservationValue.value)
    return createSchedulingAlgorithmPayload(schedulingAlgorithms.BEST_FIT_TIME);
  if (reservationValue.submissionValueType === submissionValueTypes.FILTER)
    return createSchedulingAlgorithmPayload(schedulingAlgorithms.BEST_FIT_OBJECT);
  return createSchedulingAlgorithmPayload(schedulingAlgorithms.EXACT);
};

/**
 * @function formatSubmissionValue
 * @description returns a formatted submission value for html output
 * @param {Array} submissionValue the submission value(s)
 * @param {String} submissionValueType the submission value type
 * @returns {Array} formattedSubmissionValues
 */
export const formatSubmissionValue = (submissionValue, submissionValueType) => {
  if (submissionValueType === submissionValueTypes.FILTER)
    return submissionValue.map(el => `Field: ${el.field}, value: ${el.value[0]}`);
  return submissionValue;
};
