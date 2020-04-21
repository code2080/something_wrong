import { getTimingModeForActivity } from './activities.helpers'
import { mappingTimingModes } from '../Constants/mappingTimingModes.constants';
import { activityValueStatuses } from '../Constants/activityStatuses.constants';
import { activityValueValidations } from '../Constants/activityValueValidations.constants';
import { ActivityValueValidation } from '../Models/ActivityValueValidation.model';
import { submissionValueTypes } from '../Constants/submissionValueTypes.constants';

export const validateGeneralValue = activityValue => {
  if (
    activityValue.value &&
    activityValue.value !== null
  )
    return new ActivityValueValidation({
      status: activityValueStatuses.READY_FOR_SCHEDULING,
    });

  return new ActivityValueValidation({
    status: activityValueStatuses.MISSING_DATA,
    errorCode: activityValueValidations.MISSING_VALUE,
    errorMessage: 'The value has an incorrect format, please update it manually',
  });
}

export const validateFilterValue = activityValue => {
  if (
    !activityValue.value ||
    !activityValue.value.value ||
    !activityValue.value.value[0]
  )
    return new ActivityValueValidation({
      status: activityValueStatuses.MISSING_DATA,
      errorCode: activityValueValidations.MISSING_VALUE,
      errorMessage: 'The value has an incorrect format, please update it manually',
    });

  return new ActivityValueValidation({
    status: activityValueStatuses.READY_FOR_SCHEDULING,
  });
}

export const validateTimeslotTimingMode = activity => {
  const startTime = activity.timing.find(el => el.extId === 'startTime');
  const length = activity.timing.find(el => el.extId === 'length');
  const endTime = activity.timing.find(el => el.extId === 'endTime');
  if (!startTime || !length || !endTime || !startTime.value || !length.value || !endTime.value)
    return new ActivityValueValidation({
      status: activityValueStatuses.MISSING_DATA,
      errorCode: activityValueValidations.MISSING_VALUE,
      errorMessage: 'Start time, end time or length are missing, please input these values manually to calculate a time range',
    });

  return new ActivityValueValidation({
    status: activityValueStatuses.READY_FOR_SCHEDULING,
  });
};

export const validateExactTimingMode = activity => {
  const startTime = activity.timing.find(el => el.extId === 'startTime');
  const endTime = activity.timing.find(el => el.extId === 'endTime');
  if (!startTime || !endTime || !startTime.value || !endTime.value)
    return new ActivityValueValidation({
      status: activityValueStatuses.MISSING_DATA,
      errorCode: activityValueValidations.MISSING_VALUE,
      errorMessage: 'Start time or end time are missing, please input these values manually to schedule this activity',
    });

  return new ActivityValueValidation({
    status: activityValueStatuses.READY_FOR_SCHEDULING,
  });
}

export const validateTiming = activity => {
  const timingMode = getTimingModeForActivity(activity);
  switch (timingMode) {
    case mappingTimingModes.EXACT:
      return validateExactTimingMode(activity);
    case mappingTimingModes.TIMESLOTS:
      return validateTimeslotTimingMode(activity);
    case mappingTimingModes.SEQUENCE:
    default:
      return false;
  }
};

export const validateValue = activityValue => {
  switch (activityValue.submissionValueType) {
    case submissionValueTypes.FILTER:
      return validateFilterValue(activityValue);
    default:
      return validateGeneralValue(activityValue);
  }
};