import { getTimingModeForActivity } from './activities.helpers';
import { determineContentOfValue } from './activityValues.helpers';
import { activityTimeModes } from '../Constants/activityTimeModes.constants';
import { activityValueStatuses } from '../Constants/activityStatuses.constants';
import { activityValueValidations } from '../Constants/activityValueValidations.constants';
import { ActivityValueValidation } from '../Models/ActivityValueValidation.model';
import { submissionValueTypes } from '../Constants/submissionValueTypes.constants';
import { compact, isEmpty, groupBy } from 'lodash';

export const validateGeneralValue = (_activityValue) => {
  // TODO: Reenable when we're improving the logic to consider mandatory values
  // if (activityValue.value !== null && activityValue.value !== undefined) {
  //   return new ActivityValueValidation({
  //     status: activityValueStatuses.READY_FOR_SCHEDULING,
  //   });
  // }
  // return new ActivityValueValidation({
  //   status: activityValueStatuses.MISSING_DATA,
  //   errorCode: activityValueValidations.MISSING_VALUE,
  //   errorMessage:
  //     'The value has an incorrect format, please update it manually',
  // });

  return new ActivityValueValidation({
    status: activityValueStatuses.READY_FOR_SCHEDULING,
  });
};

/**
 * @function validateMandatoryFieldValue
 * @description Check if missing mandatory field value
 * @param {ActivityValue} activityValue
 * @param {ActivityDesign} activityDesign
 * @returns {Boolean}
 */
export const validateMandatoryFieldValue = (activityValue, activityDesign) => {
  if (!activityDesign) return true;
  const mandatoryFields = Object.keys(activityDesign.propSettings).filter(
    (key) => activityDesign.propSettings[key]?.mandatory,
  );
  const isMandatoryField = mandatoryFields.includes(activityValue.extId);
  const hasValue = !isEmpty(compact(activityValue.value));

  return !isMandatoryField || hasValue;
};

/**
 * @function validateActivityByMandatoryFieldValue
 * @description Check if activity is missing any mandatory field value
 * @param {Activity} activity
 * @param {ActivityDesign} activityDesign
 * @returns {Boolean}
 */
export const validateActivityByMandatoryFieldValue = (
  activity,
  activityDesign,
) => {
  const groupedValues = groupBy(activity.values, 'extId');
  return Object.values(groupedValues).every((values) => {
    return values.some((activityValue) =>
      validateMandatoryFieldValue(activityValue, activityDesign),
    );
  });
};

export const validateFilterValue = (activityValue) => {
  if (
    !activityValue.value ||
    (activityValue.value.categories == null &&
      activityValue.value.searchFields == null)
  ) {
    return new ActivityValueValidation({
      status: activityValueStatuses.MISSING_DATA,
      errorCode: activityValueValidations.MISSING_VALUE,
      errorMessage:
        'The value has an incorrect format, please update it manually',
    });
  }
  return new ActivityValueValidation({
    status: activityValueStatuses.READY_FOR_SCHEDULING,
  });
};

export const validateTimeslotTimeMode = (activity) => {
  const startTime = activity.timing.find((el) => el.extId === 'startTime');
  const length = activity.timing.find((el) => el.extId === 'length');
  const endTime = activity.timing.find((el) => el.extId === 'endTime');
  if (
    !startTime ||
    !length ||
    !endTime ||
    !startTime.value ||
    !length.value ||
    !endTime.value
  ) {
    return new ActivityValueValidation({
      status: activityValueStatuses.MISSING_DATA,
      errorCode: activityValueValidations.MISSING_VALUE,
      errorMessage:
        'Start time, end time or length are missing, please input these values manually to calculate a time range',
    });
  }

  return new ActivityValueValidation({
    status: activityValueStatuses.READY_FOR_SCHEDULING,
  });
};

export const validateExactTimingMode = (activity) => {
  const startTime = activity.timing.find((el) => el.extId === 'startTime');
  const endTime = activity.timing.find((el) => el.extId === 'endTime');
  if (!startTime || !endTime || !startTime.value || !endTime.value) {
    return new ActivityValueValidation({
      status: activityValueStatuses.MISSING_DATA,
      errorCode: activityValueValidations.MISSING_VALUE,
      errorMessage:
        'Start time or end time are missing, please input these values manually to schedule this activity',
    });
  }

  return new ActivityValueValidation({
    status: activityValueStatuses.READY_FOR_SCHEDULING,
  });
};

export const validateTiming = (activity) => {
  const timingMode = getTimingModeForActivity(activity);
  switch (timingMode) {
    case activityTimeModes.EXACT:
      return validateExactTimingMode(activity);
    case activityTimeModes.TIMESLOTS:
      return validateTimeslotTimeMode(activity);
    case activityTimeModes.SEQUENCE:
      return new ActivityValueValidation({
        status: activityValueStatuses.READY_FOR_SCHEDULING,
      });
    default:
      return false;
  }
};

export const validateValue = (activityValue) => {
  if (determineContentOfValue(activityValue) === submissionValueTypes.FILTER) {
    return validateFilterValue(activityValue);
  }
  return validateGeneralValue(activityValue);
};
