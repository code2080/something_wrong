import React from 'react';
import moment from 'moment';

// COMPONENTS
import LengthValue from '../ValueTypes/LengthValue.jsx';
import PaddingValue from '../ValueTypes/PaddingValue.jsx';
import DateRangesValue from '../ValueTypes/DateRangesValue.jsx';
import TimeSlotTimeValue from '../ValueTypes/TimeSlotTimeValue.jsx';
import ExactTimeModeTimeValue from '../ValueTypes/ExactTimeModeTimeValue';
import TimeValue from '../ValueTypes/TimeValue';
import WeekdayValue from '../ValueTypes/WeekdayValue';

// CONSTANTS
import { activityTimeModes } from '../../../../Constants/activityTimeModes.constants';
import { DATE_FORMAT, TIME_FORMAT } from '../../../../Constants/common.constants';
import { activityValueStatuses } from '../../../../Constants/activityStatuses.constants';

// HELPERS
import { ActivityValueRenderPayload } from './RenderPayload';

// VALIDATION
import { validateGeneralValue, validateTimeslotTimeMode } from '../../../../Utils/activityValues.validation';

/**
 * @function getTimeModeForActivity
 * @description Get timing mode (EXACT, TIMESLOTS, SEQUENCE) for activity
 * @param {Activity} activity
 * @returns string
 */
export const determineTimeModeForActivity = activity => {
  try {
    const aV = activity.timing.find(el => el.extId === 'mode');
    return aV.value;
  } catch (error) {
    return null;
  }
};

/**
 * @function getRenderPayloadForTimeSlotStartTime
 * @description extracts and validates the values for a timeslot's start time
 * @param {Object} activityValue the activityValue
 * @param {Object} timingValues all timing values
 * @returns {Object} schedulingValuePayload
 */

const renderTimeSlotStartTimeValue = (
  activityValue,
  timingValues,
  activityId,
) => {
  const validationResult = validateTimeslotTimeMode({ timing: timingValues });
  if (validationResult.errorCode)
    return ActivityValueRenderPayload.create({
      status: validationResult.status,
      errorMessage: validationResult.errorMessage,
    });

  const endTime = timingValues.find(el => el.extId === 'endTime');
  const length = timingValues.find(el => el.extId === 'length');
  return ActivityValueRenderPayload.create({
    status: activityValueStatuses.READY_FOR_SCHEDULING,
    value: [activityValue.value, moment(endTime.value).subtract(length.value, 'hours')],
    renderedComponent: (
      <TimeSlotTimeValue
        formattedValue={`${moment(activityValue.value).format(DATE_FORMAT)} ${moment(activityValue.value).format(TIME_FORMAT)} - ${moment(endTime.value).subtract(length.value, 'hours').format(TIME_FORMAT)}`}
        extId={activityValue.extId}
        activityId={activityId}
      />
    )
  });
};

/**
 * @function getRenderPayloadForTimeSlotEndTime
 * @description extracts and validates the values for a timeslot's end time
 * @param {ActivityValue} activityValue the activityValue
 * @param {Object} timingValues all timing values
 * @returns {Object} schedulingValuePayload
 */
const renderTimeSlotEndTimeValue = (
  activityValue,
  timingValues,
  activityId
) => {
  // Validate the time slot
  const validationResult = validateTimeslotTimeMode({ timing: timingValues });
  if (validationResult.errorCode)
    return ActivityValueRenderPayload.create({
      status: validationResult.status,
      errorMessage: validationResult.errorMessage,
    });

  const startTime = timingValues.find(el => el.extId === 'startTime');
  const length = timingValues.find(el => el.extId === 'length');
  return ActivityValueRenderPayload.create({
    status: activityValueStatuses.READY_FOR_SCHEDULING,
    value: [moment(startTime.value).add(length.value, 'hours'), moment(activityValue.value)],
    renderedComponent: (
      <TimeSlotTimeValue
        formattedValue={`${moment(startTime.value).format(DATE_FORMAT)} ${moment(startTime.value).add(length.value, 'hours').format(TIME_FORMAT)} - ${moment(activityValue.value).format(TIME_FORMAT)}`}
        extId={activityValue.extId}
        activityId={activityId}
      />
    ),
  });
};

/**
 * @function renderLengthValue
 * @param {ActivityValue} activityValue
 * @param {String} activityId
 * @returns RenderPayload
 */
const renderLengthValue = (activityValue, activityId) => {
  const { value } = activityValue;
  if (!value)
    return ActivityValueRenderPayload.create({
      status: activityValueStatuses.MISSING_DATA, // Missing length parameter is a validation error
      errorMessage: 'Duration parameter is missing, please edit it manually'
    });

  return ActivityValueRenderPayload.create({
    status: activityValueStatuses.READY_FOR_SCHEDULING, // Missing data range value is not a failed validation
    value,
    renderedComponent: <LengthValue value={value} extId={activityValue.extId} activityId={activityId} />,
  });
}

/**
 * @function getRenderPayloadForDateRangesValue
 * @description get the rendering payload for a value of extId === dateRanges
 * @param {ActivityValue} activityValue
 * @returns RenderPayload
 */
const renderDateRangesValue = (activityValue, activityId) => {
  const { value } = activityValue;
  // Date ranges need to have a start time
  if (!value || !value.startTime)
    return ActivityValueRenderPayload.create({
      status: activityValueStatuses.READY_FOR_SCHEDULING, // Missing data range value is not a failed validation
      value: null,
      renderedComponent: 'N/A',
    });
  // ... but end time is optional
  return ActivityValueRenderPayload.create({
    status: activityValueStatuses.READY_FOR_SCHEDULING,
    value: [value.startTime, value.endTime],
    renderedComponent: <DateRangesValue startTime={value.startTime} endTime={value.endTime} extId={activityValue.extId} activityId={activityId} />,
  })
};

/**
 * @function renderPaddingValue
 * @description get the rendering payload for a value of extId === padding
 * @param {ActivityValue} activityValue
 * @returns RenderPayload
 */
const renderPaddingValue = (activityValue, activityId) => {
  const { value } = activityValue;
  // At least one padding variable is mandatory, otherwise null value (in itself not a failed validation)
  if (!value || (!value.before && !value.after))
    return ActivityValueRenderPayload.create({
      status: activityValueStatuses.READY_FOR_SCHEDULING,
      value: [],
      renderedComponent: 'N/A',
    });

  return ActivityValueRenderPayload.create({
    status: activityValueStatuses.READY_FOR_SCHEDULING,
    value: [value.before, value.after],
    renderedComponent: <PaddingValue before={value.before} after={value.after} extId={activityValue.extId} activityId={activityId} />,
  });
}

/**
 * @function renderExactTimeModeTimeValue
 * @description validates and returns a EXACT time mode start or end time
 * @param {ActivityValue} activityValue
 * @returns RenderPayload
 */
const renderExactTimeModeTimeValue = (activityValue, activityId) => {
  const validation = validateGeneralValue(activityValue);
  if (validation.errorCode)
    return ActivityValueRenderPayload.create({
      status: activityValueStatuses.MISSING_DATA,
      errorMessage: validation.errorMessage,
    });
  return ActivityValueRenderPayload.create({
    status: activityValueStatuses.READY_FOR_SCHEDULING,
    value: activityValue.value,
    renderedComponent: <ExactTimeModeTimeValue extId={activityValue.extId} value={activityValue.value} activityId={activityId} />,
  })
}

/**
 * @function renderTimeValue
 * @description renders a time value in time mode === SEQUENCE
 * @param {ActivityValue} activityValue
 * @returns RenderPayload
 */
const renderTimeValue = (activityValue, activityId) => ActivityValueRenderPayload.create({
  status: activityValueStatuses.READY_FOR_SCHEDULING,
  value: activityValue.value,
  renderedComponent: <TimeValue value={activityValue.value} extId={activityValue.extId} activityId={activityId} />,
});

/**
 * @function renderTimeValue
 * @description renders a time value in time mode === SEQUENCE
 * @param {ActivityValue} activityValue
 * @returns RenderPayload
 */
const renderWeekDayValue = (activityValue, activityId) => ActivityValueRenderPayload.create({
  status: activityValueStatuses.READY_FOR_SCHEDULING,
  value: activityValue.value,
  renderedComponent: <WeekdayValue value={activityValue.value} extId={activityValue.extId} activityId={activityId} />,
});

/**
 * @function renderTimingComponent
 * @description Entry point for rendering all timing components
 * @param {ActivityValue} activityValue
 * @param {Activity} activity
 * @returns RenderPayload
 */
export const renderTimingComponent = (activityValue, activity) => {
  // Determine time mode
  const timeMode = determineTimeModeForActivity(activity);

  // CASE: start time and time slots
  if (activityValue.extId === 'startTime' && timeMode === activityTimeModes.TIMESLOTS)
    return renderTimeSlotStartTimeValue(activityValue, activity.timing, activity._id);

  // CASE: end time and time slots
  if (activityValue.extId === 'endTime' && timeMode === activityTimeModes.TIMESLOTS)
    return renderTimeSlotEndTimeValue(activityValue, activity.timing, activity._id);

  // CASE: length value for duration
  if (activityValue.extId === 'length')
    return renderLengthValue(activityValue, activity._id);

  // CASE: dateRanges for sequence scheduling
  if (activityValue.extId === 'dateRanges')
    return renderDateRangesValue(activityValue, activity._id);

  // CASE: padding
  if (activityValue.extId === 'padding')
    return renderPaddingValue(activityValue, activity._id);

  // CASE: startTime, endTime in EXACT mode
  if ((activityValue.extId === 'startTime' || activityValue.extId === 'endTime') && timeMode === activityTimeModes.EXACT)
    return renderExactTimeModeTimeValue(activityValue, activity._id);

  if (activityValue.extId === 'time')
    return renderTimeValue(activityValue, activity._id);

  if (activityValue.extId === 'weekday')
    return renderWeekDayValue(activityValue, activity._id);

  return ActivityValueRenderPayload.create({
    status: activityValueStatuses.MISSING_DATA,
    errorMessage: 'Activity value contains unknown property type',
  });
};
