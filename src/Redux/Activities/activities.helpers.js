import _ from 'lodash';
import moment from 'moment';
import {
  activityValueModes,
  activityValueModeProps
} from '../../Constants/activityValueModes.constants';
import {
  submissionValueTypes,
  submissionValueTypeProps
} from '../../Constants/submissionValueTypes.constants';
import { mappingTimingModes } from '../../Constants/mappingTimingModes.constants';
import {
  activityValueStatuses,
  activityValueStatusProps
} from '../../Constants/activityStatuses.constants';
import { mappingTypes } from '../../Constants/mappingTypes.constants';
import {
  schedulingAlgorithms,
  schedulingAlgorithmProps
} from '../../Constants/schedulingAlgorithms.constants';

export const getTimingModeForActivity = activity => {
  try {
    const aV = activity.timing.find(el => el.extId === 'mode');
    return aV.value;
  } catch (error) {
    return null;
  }
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
 * @function findObjectPathForActivityValue
 * @description finds the path (timing or values) for a value for a certain extId
 * @param {String} valueExtId the extId of the value we're looking for
 * @param {Object} activity the activity with all its values
 * @returns {String} values || timing
 */
const findObjectPathForActivityValue = (valueExtId, activity) => {
  const timingIdx = activity.timing.findIndex(el => el.extId === valueExtId);
  if (timingIdx > -1) return 'timing';
  const valueIdx = activity.values.findIndex(el => el.extId === valueExtId);
  if (valueIdx > -1) return 'values';
  return null;
};

/**
 * @function updateActivityWithNewValue
 * @description returns a new activity with an updated activity value
 * @param {Object} newActivityValue the new activity value object
 * @param {Object} activity the original activity
 * @param {String} objPath the path to mutate (timing, values)
 * @returns {Object} updated activity
 */
const updateActivityWithNewValue = (newActivityValue, activity, objPath) => {
  const valueIdx = activity[objPath].findIndex(
    el => el.extId === newActivityValue.extId
  );
  if (valueIdx === -1) return null;
  return {
    ...activity,
    [objPath]: [
      ...activity[objPath].slice(0, valueIdx),
      { ...newActivityValue },
      ...activity[objPath].slice(valueIdx + 1)
    ]
  };
};

/**
 * @function updateSingleActivityValue
 * @description performs a manual override of a single value
 * @param {Any} newValue the new value
 * @param {Object} activityValue the old activityValue
 * @param {Object} activity the old activity
 */
const updateSingleActivityValue = (newValue, activityValue, activity) => {
  const newActivityValue = {
    ...activityValue,
    value: newValue,
    valueMode: activityValueModes.MANUAL
  };
  const objPath = findObjectPathForActivityValue(
    newActivityValue.extId,
    activity
  );
  if (!objPath) return null;
  return updateActivityWithNewValue(newActivityValue, activity, objPath);
};

/**
 * @function updateMultipleActivityValues
 * @description performs a manual override of multiple values
 * @param {Any} newValue the new value
 * @param {Object} activityValue the old activityValue
 * @param {Object} activity the old activity
 */
const updateMultipleActivityValues = (newValue, activityValue, activity) => {
  let updatedActivity = activity;
  newValue.forEach(value => {
    const objPath = findObjectPathForActivityValue(value.extId, activity);
    const activityValueIdx = activity[objPath].findIndex(
      el => el.extId === value.extId
    );
    updatedActivity[objPath] = [
      ...updatedActivity[objPath].slice(0, activityValueIdx),
      {
        ...activity[objPath][activityValueIdx],
        value: value.value,
        valueMode: activityValueModes.MANUAL
      },
      ...updatedActivity[objPath].slice(activityValueIdx + 1)
    ];
  });
  return updatedActivity;
};

/**
 * @function manuallyOverrideActivityValue
 * @description return a new activity value with a manually overriden value param
 * @param {String || Number} newValue the new value
 * @param {Object} activityValue the original activity value
 * @param {Object} activity the original activity on which the activity value resides
 * @returns {Object} updated activity
 */
export const manuallyOverrideActivityValue = (
  newValue,
  activityValue,
  activity
) => {
  /**
   * All props only affect themselves, except for certain timing changes
   */
  const timingMode = getTimingModeForActivity(activity);
  if (
    timingMode !== mappingTimingModes.EXACT &&
    (activityValue.extId === 'startTime' || activityValue.extId === 'endTime')
  )
    return updateMultipleActivityValues(newValue, activityValue, activity);

  return updateSingleActivityValue(newValue, activityValue, activity);
};

const revertMultipleActivityValues = (extIds, activity) => {
  let updatedActivity = activity;
  extIds.forEach(extId => {
    const objPath = findObjectPathForActivityValue(extId, activity);
    const activityValueIdx = activity[objPath].findIndex(
      el => el.extId === extId
    );
    updatedActivity[objPath] = [
      ...updatedActivity[objPath].slice(0, activityValueIdx),
      {
        ...activity[objPath][activityValueIdx],
        value: activity[objPath][activityValueIdx].submissionValue[0],
        valueMode: activityValueModes.FROM_SUBMISSION
      },
      ...updatedActivity[objPath].slice(activityValueIdx + 1)
    ];
  });
  return updatedActivity;
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
   * value should then be reverted to submissionValue[0]
   * most reverts only affect the activity value itself
   * but reverting timeslots needs to happen on both start and endtime properties
   */
  const { submissionValue } = activityValue;
  const timingMode = getTimingModeForActivity(activity);
  if (
    timingMode !== mappingTimingModes.EXACT &&
    (activityValue.extId === 'startTime' || activityValue.extId === 'endTime')
  ) {
    return revertMultipleActivityValues(['startTime', 'endTime'], activity);
  } else {
    return updateActivityWithNewValue(
      {
        ...activityValue,
        valueMode: activityValueModes.FROM_SUBMISSION,
        value: submissionValue[0]
      },
      activity,
      findObjectPathForActivityValue(activityValue.extId, activity)
    );
  }
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
const createSchedulingValuePayload = ({
  status,
  rawValue,
  formattedValue,
  errorMessage
}) => ({
  status,
  rawValue:
    status === activityValueStatuses.MISSING_DATA
      ? activityValueStatusProps[activityValueStatuses.MISSING_DATA].label
      : rawValue,
  formattedValue:
    status === activityValueStatuses.MISSING_DATA
      ? activityValueStatusProps[activityValueStatuses.MISSING_DATA].label
      : formattedValue,
  errorMessage:
    errorMessage ||
    (status === activityValueStatuses.MISSING_DATA
      ? activityValueStatusProps[activityValueStatuses.MISSING_DATA].tooltip
      : null)
});

/**
 * @function getSchedulingPayloadForTimeSlotStartTime
 * @description extracts and validates the values for start time with timeslots
 * @param {Object} activityValue the activityValue
 * @param {Object} timingValues all timing values
 * @returns {Object} schedulingValuePayload
 */

const getSchedulingPayloadForTimeSlotStartTime = (
  activityValue,
  timingValues
) => {
  if (!activityValue.value)
    return createSchedulingValuePayload({
      status: activityValueStatuses.MISSING_DATA,
      errorMessage:
        'Start time is missing, please input the value manually to calculate a start time range'
    });

  const _length = timingValues.find(el => el.extId === 'length');
  const _endTime = timingValues.find(el => el.extId === 'endTime');
  if (!_length || !_endTime || !_length.value || !_endTime.value)
    return createSchedulingValuePayload({
      status: activityValueStatuses.MISSING_DATA,
      errorMessage:
        'End time or length is missing, please input these values manually to calculate a start time range'
    });

  const startTime = activityValue.value;
  const length = _length.value;
  const endTime = _endTime.value;

  return createSchedulingValuePayload({
    status: activityValueStatuses.READY_FOR_SCHEDULING,
    value: [startTime, moment(endTime).subtract(length, 'hours')],
    formattedValue: `${moment(startTime).format('YYYY-MM-DD')} ${moment(
      startTime
    ).format('HH:mm')} - ${moment(endTime)
      .subtract(length, 'hours')
      .format('HH:mm')}`
  });
};

/**
 * @function getSchedulingPayloadForTimeSlotEndTime
 * @description extracts and validates the values for end time with timeslots
 * @param {Object} activityValue the activityValue
 * @param {Object} timingValues all timing values
 * @returns {Object} schedulingValuePayload
 */
const getSchedulingPayloadForTimeSlotEndTime = (
  activityValue,
  timingValues
) => {
  if (!activityValue.value)
    return createSchedulingValuePayload({
      status: activityValueStatuses.MISSING_DATA,
      errorMessage:
        'End time is missing, please input the value manually to calculate an end time range'
    });

  const _length = timingValues.find(el => el.extId === 'length');
  const _startTime = timingValues.find(el => el.extId === 'startTime');
  if (!_length || !_startTime || !_length.value || !_startTime.value)
    return createSchedulingValuePayload({
      status: activityValueStatuses.MISSING_DATA,
      errorMessage:
        'Start time or length is missing, please input these values manually to calculate a start time range'
    });

  const endTime = activityValue.value;
  const length = _length.value;
  const startTime = _startTime.value;
  return createSchedulingValuePayload({
    status: activityValueStatuses.READY_FOR_SCHEDULING,
    value: [moment(startTime).add(length, 'hours'), moment(endTime)],
    formattedValue: `${moment(startTime).format('YYYY-MM-DD')} ${moment(
      startTime
    )
      .add(length, 'hours')
      .format('HH:mm')} - ${moment(endTime).format('HH:mm')}`
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
      formattedValue: activityValue.value
    });
  if (
    !activityValue.submissionValue[0] ||
    !activityValue.submissionValue[0].value ||
    !activityValue.submissionValue[0].value[0]
  )
    return createSchedulingValuePayload({
      status: activityValueStatuses.MISSING_DATA
    });
  return createSchedulingValuePayload({
    status: activityValueStatuses.READY_FOR_SCHEDULING,
    value: activityValue.submissionValue,
    formattedValue: activityValue.submissionValue
      .map(el => `Field: ${el.field}, value: ${el.value[0]}`)
      .toString()
  });
};

const addExtrasToReservationValue = (activityValue, mappingType) => {
  // If manual, always return manual
  if (activityValue.valueMode === activityValueModes.MANUAL)
    return {
      icon: activityValueModeProps[activityValueModes.MANUAL].icon,
      tooltip: 'The value was entered manually by the user'
    };
  // If from submission, we need to check if it's a filer or not
  if (activityValue.submissionValueType === submissionValueTypes.FILTER)
    return {
      icon: submissionValueTypeProps[submissionValueTypes.FILTER].icon,
      tooltip: 'The object filter values are from the submission'
    };
  // Else, if it's a timing property and we DON'T have a value
  if (mappingType === mappingTypes.TIMING)
    return {
      icon: 'column-height',
      tooltip: 'The timing is based on the submission'
    };
  // Else, return from submission
  return {
    icon: activityValueModeProps[activityValueModes.FROM_SUBMISSION].icon,
    tooltip: 'The value is from the submission'
  };
};

/**
 * @function getSchedulingPayloadForActivityValue
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
  if (
    activityValue.extId === 'startTime' &&
    timingMode.value === mappingTimingModes.TIMESLOTS
  )
    retVal = getSchedulingPayloadForTimeSlotStartTime(
      activityValue,
      activity.timing
    );

  // Special case: end time and time slots
  if (
    activityValue.extId === 'endTime' &&
    timingMode.value === mappingTimingModes.TIMESLOTS
  )
    retVal = getSchedulingPayloadForTimeSlotEndTime(
      activityValue,
      activity.timing
    );

  // Special case: filters
  if (activityValue.submissionValueType === submissionValueTypes.FILTER)
    retVal = getSchedulingPayloadForObjectFilter(activityValue);

  // TODO Workaround to not crash when activityValue becomes a whole returned TimeEdit object
  if (activityValue.type === 'object' && activityValue.value.extid) {
    formatFn = teObject => teObject.extid;
  }
  // General case
  if (!retVal)
    retVal = createSchedulingValuePayload({
      status: activityValue.value
        ? activityValueStatuses.READY_FOR_SCHEDULING
        : activityValueStatuses.MISSING_DATA,
      value: activityValue.value ? activityValue.value : null,
      formattedValue: activityValue.value ? formatFn(activityValue.value) : null
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
  ...schedulingAlgorithmProps[schedulingAlgorithm]
});

/**
 * @function getSchedulingAlgorithmForActivityValue
 * @description assert which algorithm that should be used for scheduling the activity value
 * @param {Object} activityValue the activity value to be asserted
 * @param {String} mappingType the prop type it's mapped to
 */
export const getSchedulingAlgorithmForActivityValue = (
  activityValue,
  mappingType
) => {
  if (activityValue.valueMode === activityValueModes.MANUAL)
    return createSchedulingAlgorithmPayload(schedulingAlgorithms.EXACT);
  if (mappingType === mappingTypes.TIMING && !activityValue.value)
    return createSchedulingAlgorithmPayload(schedulingAlgorithms.BEST_FIT_TIME);
  if (activityValue.submissionValueType === submissionValueTypes.FILTER)
    return createSchedulingAlgorithmPayload(
      schedulingAlgorithms.BEST_FIT_OBJECT
    );
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
    return submissionValue.map(
      el => `Field: ${el.field}, value: ${el.value[0]}`
    );
  return submissionValue;
};
