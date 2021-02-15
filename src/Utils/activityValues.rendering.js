import moment from 'moment';
import _ from 'lodash';

// VALIDATION HELPERS
import { validateTimeslotTimingMode, validateFilterValue, validateGeneralValue } from './activityValues.validation';

// HELPERS
import { determineSchedulingAlgorithmForActivityValue } from './scheduling.helpers';
import { determineContentOfValue } from './activityValues.helpers';
import { getTimingModeForActivity } from './activities.helpers';
import { minToHourMinDisplay } from './moment.helpers';

// CONSTANTS
import { activityValueModes, activityValueModeProps } from '../Constants/activityValueModes.constants';
import { activityValueStatuses, activityValueStatusProps } from '../Constants/activityStatuses.constants';
import { mappingTypes } from '../Constants/mappingTypes.constants';
import { schedulingAlgorithmProps } from '../Constants/schedulingAlgorithms.constants';
import { submissionValueTypes, submissionValueTypeProps } from '../Constants/submissionValueTypes.constants';
import { mappingTimingModes } from '../Constants/mappingTimingModes.constants';
import { DATE_FORMAT, TIME_FORMAT } from '../Constants/common.constants';

/**
 * @function getSchedulingAlgorithmForActivityValue
 * @description assert which algorithm that should be used for scheduling the activity value
 * @param {Object} activityValue the activity value to be asserted
 * @param {Object} activity the activity
 */
export const getSchedulingAlgorithmForActivityValue = (
  activityValue,
  activity
) => {
  const schedulingAlgorithm = determineSchedulingAlgorithmForActivityValue(activityValue, activity);
  return {
    schedulingAlgorithm,
    ...schedulingAlgorithmProps[schedulingAlgorithm],
  };
};

const generateExtrasForActivityValue = (activityValue, mappingType) => {
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
  // Else, if it's a timing property
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

const renderCategories = categories => categories.map(({ id, values }) => `${_.get(window.tePrefsLibStore.getState(), ['te', 'extIdProps', 'fields', id, 'label'], id)}: ${values}`).join(', ');
const renderSearchFields = (searchFields, searchString) => `${searchFields}: ${searchString}`;
const renderFilterValues = ({ categories, searchString, searchFields }) => categories.length ? renderCategories(categories) : renderSearchFields(searchFields, searchString)

/**
 * @function formatSubmissionValue
 * @description returns a formatted submission value for html output
 * @param {Array} submissionValue the submission value(s)
 * @param {String} submissionValueType the submission value type
 * @returns {Array} formattedSubmissionValues
 */
export const formatSubmissionValue = (submissionValue, submissionValueType) => {
  if (submissionValueType === submissionValueTypes.FILTER) {
    return renderFilterValues(submissionValue);
  }
  return submissionValue;
};

/**
 * @function createRenderPayload
 * @description creates a standardized scheduling payload for a activity value
 * @param {String} status MISSING_DATA || READY_FOR_SCHEDULING
 * @param {String} rawValue the raw value to use for scheduling
 * @param {String} formattedValue any formatted value that might be better for presentation
 * @param {String} errorMessage error message to display if validation error
 * @returns {Object} renderPayload
 */
const createRenderPayload = ({
  status,
  value,
  formattedValue,
  errorMessage
}) => ({
  status,
  rawValue:
    status === activityValueStatuses.MISSING_DATA
      ? activityValueStatusProps[activityValueStatuses.MISSING_DATA].label
      : value,
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
 * @function getRenderPayloadForTimeSlotStartTime
 * @description extracts and validates the values for a timeslot's start time
 * @param {Object} activityValue the activityValue
 * @param {Object} timingValues all timing values
 * @returns {Object} schedulingValuePayload
 */

const getRenderPayloadForTimeSlotStartTime = (
  activityValue,
  timingValues
) => {
  const validationResult = validateTimeslotTimingMode({ timing: timingValues });
  const endTime = timingValues.find(el => el.extId === 'endTime');
  const length = timingValues.find(el => el.extId === 'length');
  if (!validationResult.errorCode)
    return createRenderPayload({
      status: activityValueStatuses.READY_FOR_SCHEDULING,
      value: [activityValue.value, moment(endTime.value).subtract(length.value, 'hours')],
      formattedValue: `${moment(activityValue.value).format(DATE_FORMAT)} ${moment(
        activityValue.value
      ).format(TIME_FORMAT)} - ${moment(endTime.value)
        .subtract(length.value, 'hours')
        .format(TIME_FORMAT)}`
    });

  return createRenderPayload({
    status: validationResult.status,
    errorMessage: validationResult.errorMessage,
  });
};

/**
 * @function getRenderPayloadForTimeSlotEndTime
 * @description extracts and validates the values for a timeslot's end time
 * @param {Object} activityValue the activityValue
 * @param {Object} timingValues all timing values
 * @returns {Object} schedulingValuePayload
 */
const getSchedulingPayloadForTimeSlotEndTime = (
  activityValue,
  timingValues
) => {
  const validationResult = validateTimeslotTimingMode({ timing: timingValues });
  const startTime = timingValues.find(el => el.extId === 'startTime');
  const length = timingValues.find(el => el.extId === 'length');
  if (!validationResult.errorCode)
    return createRenderPayload({
      status: activityValueStatuses.READY_FOR_SCHEDULING,
      value: [moment(startTime.value).add(length.value, 'hours'), moment(activityValue.value)],
      formattedValue: `${moment(startTime.value).format(DATE_FORMAT)} ${moment(
        startTime.value
      )
        .add(length.value, 'hours')
        .format(TIME_FORMAT)} - ${moment(activityValue.value).format(TIME_FORMAT)}`
    });

  return createRenderPayload({
    status: validationResult.status,
    errorMessage: validationResult.errorMessage,
  });
};

/**
 * @function getRenderPayloadForDateRangesValue
 * @description get the rendering payload for a value of extId === dateRanges
 * @param {ActivityValue} activityValue
 * @returns RenderPayload
 */
const getRenderPayloadForDateRangesValue = activityValue => {
  const { value } = activityValue;
  // Date ranges need to have a start time
  if (!value || !value.startTime)
    return createRenderPayload({
      status: activityValueStatuses.READY_FOR_SCHEDULING, // Missing data range value is not a failed validation
      value: null,
      formattedValue: null,
    });
  // ... but end time is optional
  if (!value.endTime)
    return createRenderPayload({
      status: activityValueStatuses.READY_FOR_SCHEDULING,
      value: [value.startTime],
      formattedValue: `On or after: ${value.startTime}`
    });
  // All data exists
  return createRenderPayload({
    status: activityValueStatuses.READY_FOR_SCHEDULING,
    value: [value.startTime, value.endTime],
    formattedValue: `Start: ${value.startTime}, End: ${value.endTime}`
  });
};

/**
 * @function getRenderPayloadForPaddingValue
 * @description get the rendering payload for a value of extId === padding
 * @param {ActivityValue} activityValue
 * @returns RenderPayload
 */
const getRenderPayloadForPaddingValue = activityValue => {
  const { value } = activityValue;
  // At least one padding variable is mandatory, otherwise null value (in itself not a failed validation)
  
  if(!value)
    return null

    
  if (!value.before && !value.after)
    return createRenderPayload({
      status: activityValueStatuses.READY_FOR_SCHEDULING,
      value: null,
      formattedValue: null,
    });
  // Only before is set
  if (value.before && !value.after) {
    const { days, hours, minutes } = minToHourMinDisplay(value.before);
    return createRenderPayload({
      status: activityValueStatuses.READY_FOR_SCHEDULING,
      value: [value.before],
      formattedValue: `Padding before: ${days ? `${days}d, ${hours}:${minutes}` : `${hours}:${minutes}`}`,
    });
  }

  // Only before is set
  if (!value.before && value.after) {
    const { days, hours, minutes } = minToHourMinDisplay(value.after);
    return createRenderPayload({
      status: activityValueStatuses.READY_FOR_SCHEDULING,
      value: [value.after],
      formattedValue: `Padding after:  ${days ? `${days}d, ${hours}:${minutes}` : `${hours}:${minutes}`}`,
    });
  }
  // Both are set
  const { days: bD, hours: bH, minutes: bM } = minToHourMinDisplay(value.before);
  const { days: aD, hours: aH, minutes: aM } = minToHourMinDisplay(value.after);
  return createRenderPayload({
    status: activityValueStatuses.READY_FOR_SCHEDULING,
    value: [value.before, value.after],
    formattedValue: `Padding before: ${bD ? `${bD}d, ${bH}:${bM}` : `${bH}:${bM}`}, after: ${aD ? `${aD}d, ${aH}:${aM}` : `${aH}:${aM}`}`,
  });
}

/**
 * @function getRenderPayloadForOptionalTimingValues
 * @description return a successful validation even for null values for optional timing parameters
 * @param {ActivityValue} activityValue
 * @returns RenderPayload
 */
const getRenderPayloadForOptionalTimingValues = activityValue => {
  // Key here is that a null value is not a failed validation
  return createRenderPayload({
    status: activityValueStatuses.READY_FOR_SCHEDULING,
    value: activityValue.value,
    formattedValue: activityValue.value,
  });
}

/**
 * @function getRenderPayloadForObjectFilter
 * @param {Object} activityValue the activity value
 * @returns {Object} renderPayload
 */
const getRenderPayloadForObjectFilter = activityValue => {
  const validationResult = validateFilterValue(activityValue);
  const value = Array.isArray(activityValue.value) ? activityValue.value : [activityValue.value];
  if (!validationResult.errorCode)
    return createRenderPayload({
      status: activityValueStatuses.READY_FOR_SCHEDULING,
      value,
      formattedValue: value
        .map(el => renderFilterValues(el)).join(', ')
    });

  return createRenderPayload({
    status: validationResult.status,
    errorMessage: validationResult.errorMessage,
  });
};

/**
 * @function getRenderPayloadForActivityValue
 * @description calculates the value from a activity value that should be used in scheduling
 * @param {Object} activityValue the activity value
 * @param {Object} activity the activity on which the activity value resides
 * @param {Func} formatFn if any specific formatting should be applied to the value for display
 * @param {Bool} addExtras if return should be augmented with tooltips and icon
 * @param {String} mappingType the type of mapping (field, object, timing) - required for addExtras
 */
export const getRenderPayloadForActivityValue = (
  activityValue,
  activity,
  formatFn = val => val,
  includeExtras = false,
  mappingType = null,
) => {
  const timingMode = getTimingModeForActivity(activity);
  let renderPayload = null;
  // Special case: start time and time slots
  if (activityValue.extId === 'startTime' && timingMode === mappingTimingModes.TIMESLOTS)
    renderPayload = getRenderPayloadForTimeSlotStartTime(activityValue, activity.timing);

  // Special case: end time and time slots
  if (activityValue.extId === 'endTime' && timingMode === mappingTimingModes.TIMESLOTS)
    renderPayload = getSchedulingPayloadForTimeSlotEndTime(activityValue, activity.timing);

  // Special case: dateRanges for sequence scheduling
  if (activityValue.extId === 'dateRanges')
    renderPayload = getRenderPayloadForDateRangesValue(activityValue);

  // Special case: padding
  if (activityValue.extId === 'padding')
    renderPayload = getRenderPayloadForPaddingValue(activityValue);

  // For all optional timing elements
  if (['weekday', 'time'].indexOf(activityValue.extId) > -1 && timingMode === mappingTimingModes.SEQUENCE)
    renderPayload = getRenderPayloadForOptionalTimingValues(activityValue);

  // Special case: filters
  if (activityValue.submissionValueType === submissionValueTypes.FILTER && determineContentOfValue(activityValue) === submissionValueTypes.FILTER)
    renderPayload = getRenderPayloadForObjectFilter(activityValue);

  // TODO Workaround to not crash when activityValue becomes a whole returned TimeEdit object
  if (activityValue.type === 'object' && activityValue.value && activityValue.value.extid)
    formatFn = teObject => teObject.extid;

  // TODO: Workaround for unhandled object request/empty activity value
  if (activityValue.type === 'object' && _.isEmpty(activityValue.value))
    formatFn = _ => 'No values';

  // General case
  if (!renderPayload) {
    const validationResult = validateGeneralValue(activityValue);
    if (!validationResult.errorCode) {
      renderPayload = createRenderPayload({
        status: activityValueStatuses.READY_FOR_SCHEDULING,
        value: activityValue.value,
        formattedValue: Array.isArray(activityValue.value) ? activityValue.value.map(formatFn) : formatFn(activityValue.value),
      });
    } else {
      renderPayload = createRenderPayload({
        status: activityValueStatuses.MISSING_DATA,
        errorMessage: validationResult.errorMessage,
      });
    }
  }
  if (includeExtras && mappingType)
    return {
      ...renderPayload,
      ...generateExtrasForActivityValue(activityValue, mappingType)
    };
  return renderPayload;
}
