import _ from 'lodash';
import moment from 'moment';
import { activityValueModes, activityValueModeProps } from '../../Constants/activityValueModes.constants';
import { submissionValueTypes, submissionValueTypeProps } from '../../Constants/submissionValueTypes.constants';
import { mappingTimingModes } from '../../Constants/mappingTimingModes.constants';
import { activityValueStatuses, activityValueStatusProps } from '../../Constants/activityStatuses.constants';
import { mappingTypes } from '../../Constants/mappingTypes.constants';
import { schedulingAlgorithms, schedulingAlgorithmProps } from '../../Constants/schedulingAlgorithms.constants';
/**
 * @function getReservationForEvent
 * @description picks the activity corresponding to a specific event from a connected section
 * @param {Object} state a redux state object
 * @param {String} formId the form Id
 * @param {String} formInstanceId the form instance id
 * @param {String} sectionId the section id
 * @param {String} eventId the event id
 * @returns {Object} activity corresponding to the event
 */
export const getReservationForEvent = (state, formId, formInstanceId, sectionId, eventId) => {
  if (!state || !formId || !formInstanceId || !sectionId || !eventId) return [];
  const activities = _.get(state, `[${formId}][${formInstanceId}]`, []);
  return activities.find(el => el.sectionId === sectionId && el.eventId === eventId);
};

/**
 * @function getActivitiesForFormInstance
 * @description selects all the activities for a form instance
 * @param {Object} state a redux state object
 * @param {String} formId the form id
 * @param {String} formInstanceId the form instance id
 * @returns {Array} all activities for a form instance
 */
export const getActivitiesForFormInstance = (state, formId, formInstanceId) => {
  if (!state || !formId || !formInstanceId) return [];
  return _.get(state, `[${formId}][${formInstanceId}]`, []);
};

/**
 * @function findObjectPathForReservationValue
 * @description finds the path (timing or values) for a value for a certain extId
 * @param {String} valueExtId the extId of the value we're looking for
 * @param {Object} activity the activity with all its values
 * @returns {String} values || timing
 */
const findObjectPathForReservationValue = (valueExtId, activity) => {
  const timingIdx = activity.timing.findIndex(el => el.extId === valueExtId);
  if (timingIdx > -1) return 'timing';
  const valueIdx = activity.values.findIndex(el => el.extId === valueExtId);
  if (valueIdx > -1) return 'values';
  return null;
};

/**
 * @function updateReservationWithNewValue
 * @description returns a new activity with an updated activity value
 * @param {Object} newReservationValue the new activity value object
 * @param {Object} activity the original activity
 * @param {String} objPath the path to mutate (timing, values)
 * @returns {Object} updated activity
 */
const updateReservationWithNewValue = (newReservationValue, activity, objPath) => {
  const valueIdx = activity[objPath].findIndex(el => el.extId === newReservationValue.extId);
  if (valueIdx === -1) return null;
  return {
    ...activity,
    [objPath]: [
      ...activity[objPath].slice(0, valueIdx),
      { ...newReservationValue },
      ...activity[objPath].slice(valueIdx + 1),
    ],
  };
};

/**
 * @function manuallyOverrideActivityValue
 * @description return a new activity value with a manually overriden value param
 * @param {String || Number} newValue the new value
 * @param {Object} activityValue the original activity value
 * @param {Object} activity the original activity on which the activity value resides
 * @returns {Object} updated activity
 */
export const manuallyOverrideActivityValue = (newValue, activityValue, activity) => {
  const newReservationValue = { ...activityValue, value: newValue, valueMode: activityValueModes.MANUAL };
  const objPath = findObjectPathForReservationValue(newReservationValue.extId, activity);
  if (!objPath) return null;
  return updateReservationWithNewValue(newReservationValue, activity, objPath);
};

/**
 * @function revertActivityValueToSubmission
 * @description reverts a manually overriden activity to its orginal submission value
 * @param {Object} activityValue the activityValue to be reverted
 * @param {Object} activity the activity on which the activityValue resides
 * @returns {Object} updated activity
 */
export const revertActivityValueToSubmission = (activityValue, activity) => {
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
  const { submissionValueType, submissionValue } = activityValue;
  const timingMode = activity.timing.find(el => el.extId === 'mode');
  let newReservationValue;
  if (
    submissionValueType === submissionValueTypes.OBJECT ||
    submissionValueType === submissionValueTypes.FREE_TEXT ||
    (submissionValueType === submissionValueTypes.TIMING && timingMode === mappingTimingModes.EXACT) ||
    activityValue.extId === 'length'
  ) {
    newReservationValue = {
      ...activityValue,
      valueMode: activityValueModes.FROM_SUBMISSION,
      value: submissionValue[0],
    };
  } else {
    newReservationValue = {
      ...activityValue,
      valueMode: activityValueModes.FROM_SUBMISSION,
      value: null,
    };
  }

  const objPath = findObjectPathForReservationValue(newReservationValue.extId, activity);
  if (!objPath) return null;
  // 3. Update the activity and return
  return updateReservationWithNewValue(newReservationValue, activity, objPath);
};

/**
 * @function createSchedulingValuePayload
 * @description creates a standardized scheduling payload for a activity value
 * @param {String} status MISSING_DATA || READY_FOR_SCHEDULING
 * @param {String} rawValue the raw value to use for scheduling
 * @param {String} formattedValue any formatted value that might be better for presentation
 * @param {String} tooltip tooltip title to show on hover
 * @param {String} icon the icon type to use
 * @returns {Object} schedulingValuePayload
 */
const createSchedulingValuePayload = ({ status, rawValue, formattedValue, errorMessage }) => ({
  status,
  rawValue: status === activityValueStatuses.MISSING_DATA
    ? activityValueStatusProps[activityValueStatuses.MISSING_DATA].label
    : rawValue,
  formattedValue: status === activityValueStatuses.MISSING_DATA
    ? activityValueStatusProps[activityValueStatuses.MISSING_DATA].label
    : formattedValue,
  errorMessage: errorMessage ||
    (status === activityValueStatuses.MISSING_DATA
      ? activityValueStatusProps[activityValueStatuses.MISSING_DATA].tooltip
      : null),
});

/**
 * @function getSchedulingPayloadForTimeSlotStartTime
 * @description extracts and validates the values for start time with timeslots
 * @param {Object} activityValue the activityValue
 * @param {Object} timingValues all timing values
 * @returns {Object} schedulingValuePayload
 */

const getSchedulingPayloadForTimeSlotStartTime = (activityValue, timingValues) => {
  if (!activityValue.submissionValue[0])
    return createSchedulingValuePayload({
      status: activityValueStatuses.MISSING_DATA,
      errorMessage: 'Start time is missing, please input the value manually to calculate a start time range'
    });

  const _length = timingValues.find(el => el.extId === 'length');
  const _endTime = timingValues.find(el => el.extId === 'endTime');
  if (!_length || !_endTime || !_length.value || !_endTime.submissionValue[0])
    return createSchedulingValuePayload({
      status: activityValueStatuses.MISSING_DATA,
      errorMessage: 'End time or length is missing, please input these values manually to calculate a start time range'
    });

  const startTime = activityValue.submissionValue[0];
  const length = _length.value;
  const endTime = _endTime.submissionValue[0];

  return createSchedulingValuePayload({
    status: activityValueStatuses.READY_FOR_SCHEDULING,
    value: [startTime, moment(endTime).subtract(length, 'hours')],
    formattedValue: `${moment(startTime).format('YYYY-MM-DD')} ${moment(startTime).format('HH:mm')} - ${moment(endTime).subtract(length, 'hours').format('HH:mm')}`,
  });
};

/**
 * @function getSchedulingPayloadForTimeSlotEndTime
 * @description extracts and validates the values for end time with timeslots
 * @param {Object} activityValue the activityValue
 * @param {Object} timingValues all timing values
 * @returns {Object} schedulingValuePayload
 */
const getSchedulingPayloadForTimeSlotEndTime = (activityValue, timingValues) => {
  if (!activityValue.submissionValue[0])
    return createSchedulingValuePayload({
      status: activityValueStatuses.MISSING_DATA,
      errorMessage: 'End time is missing, please input the value manually to calculate an end time range',
    });

  const _length = timingValues.find(el => el.extId === 'length');
  const _startTime = timingValues.find(el => el.extId === 'startTime');
  if (!_length || !_startTime || !_length.value || !_startTime.submissionValue[0])
    return createSchedulingValuePayload({
      status: activityValueStatuses.MISSING_DATA,
      errorMessage: 'Start time or length is missing, please input these values manually to calculate a start time range',
    });

  const endTime = activityValue.submissionValue[0];
  const length = _length.value;
  const startTime = _startTime.submissionValue[0];
  return createSchedulingValuePayload({
    status: activityValueStatuses.READY_FOR_SCHEDULING,
    value: [moment(startTime).add(length, 'hours'), moment(endTime)],
    formattedValue: `${moment(startTime).format('YYYY-MM-DD')} ${moment(startTime).add(length, 'hours').format('HH:mm')} - ${moment(endTime).format('HH:mm')}`,
  });
};

/**
 * @function getSchedulingPayloadForObjectFilter
 * @param {Object} activityValue the activity value
 * @returns {Object} schedulingValuePayload
 */
const getSchedulingPayloadForObjectFilter = activityValue => {
  if (activityValue.value)
    return createSchedulingValuePayload({
      status: activityValueStatuses.READY_FOR_SCHEDULING,
      value: activityValue.value,
      formattedValue: activityValue.value,
    });
  if (
    !activityValue.submissionValue[0] ||
    !activityValue.submissionValue[0].value ||
    !activityValue.submissionValue[0].value[0]
  )
    return createSchedulingValuePayload({
      status: activityValueStatuses.MISSING_DATA,
    });
  return createSchedulingValuePayload({
    status: activityValueStatuses.READY_FOR_SCHEDULING,
    value: activityValue.submissionValue,
    formattedValue: activityValue.submissionValue.map(el => `Field: ${el.field}, value: ${el.value[0]}`).toString(),
  });
};

const addExtrasToReservationValue = (activityValue, mappingType) => {
  // If manual, always return manual
  if (activityValue.valueMode === activityValueModes.MANUAL)
    return { icon: activityValueModeProps[activityValueModes.MANUAL].icon, tooltip: 'The value was entered manually by the user' };
  // If from submission, we need to check if it's a filer or not
  if (activityValue.submissionValueType === submissionValueTypes.FILTER)
    return { icon: submissionValueTypeProps[submissionValueTypes.FILTER].icon, tooltip: 'The object filter values are from the submission' };
  // Else, if it's a timing property and we DON'T have a value
  if (mappingType === mappingTypes.TIMING && !activityValue.value)
    return { icon: 'column-height', tooltip: 'The timing range is based on the submission' };
  // Else, return from submission
  return { icon: activityValueModeProps[activityValueModes.FROM_SUBMISSION].icon, tooltip: 'The value is from the submission' };
};

/**
 * @function getReservationValueForScheduling
 * @description calculates the value from a activity value that should be used in scheduling
 * @param {Object} activityValue the activity value
 * @param {Object} activity the activity on which the activity value resides
 * @param {Func} formatFn if any specific formatting should be applied to the value for display
 * @param {Bool} addExtras if return should be augmented with tooltips and icon
 * @param {String} mappingType the type of mapping (field, object, timing) - required for addExtras
 */
export const getSchedulingPayloadForActivityValue = (
  activityValue,
  activity,
  formatFn = val => val,
  addExtras = false,
  mappingType = null
) => {
  let retVal = null;
  const timingMode = activity.timing.find(el => el.extId === 'mode');
  // Special case: start time and time slots
  if (activityValue.extId === 'startTime' && timingMode.value === mappingTimingModes.TIMESLOTS)
    retVal = getSchedulingPayloadForTimeSlotStartTime(activityValue, activity.timing);
  // Special case: end time and time slots
  if (activityValue.extId === 'endTime' && timingMode.value === mappingTimingModes.TIMESLOTS)
    retVal = getSchedulingPayloadForTimeSlotEndTime(activityValue, activity.timing);
  // Special case: filters
  if (activityValue.submissionValueType === submissionValueTypes.FILTER)
    retVal = getSchedulingPayloadForObjectFilter(activityValue);
  // General case
  if (!retVal)
    retVal = createSchedulingValuePayload({
      status: activityValue.value ? activityValueStatuses.READY_FOR_SCHEDULING : activityValueStatuses.MISSING_DATA,
      value: activityValue.value ? activityValue.value : null,
      formattedValue: activityValue.value ? formatFn(activityValue.value) : null,
    });

  if (addExtras && mappingType)
    return {
      ...retVal,
      ...addExtrasToReservationValue(activityValue, mappingType)
    };

  return retVal;
};

const createSchedulingAlgorithmPayload = schedulingAlgorithm => ({
  schedulingAlgorithm: schedulingAlgorithm,
  ...schedulingAlgorithmProps[schedulingAlgorithm],
});

/**
 * @function getSchedulingAlgorithmForActivityValue
 * @description assert which algorithm that should be used for scheduling the activity value
 * @param {Object} activityValue the activity value to be asserted
 * @param {String} mappingType the prop type it's mapped to
 */
export const getSchedulingAlgorithmForActivityValue = (activityValue, mappingType) => {
  if (activityValue.valueMode === activityValueModes.MANUAL)
    return createSchedulingAlgorithmPayload(schedulingAlgorithms.EXACT);
  if (mappingType === mappingTypes.TIMING && !activityValue.value)
    return createSchedulingAlgorithmPayload(schedulingAlgorithms.BEST_FIT_TIME);
  if (activityValue.submissionValueType === submissionValueTypes.FILTER)
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
