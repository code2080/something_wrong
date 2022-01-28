import moment from 'moment';
import _ from 'lodash';

// MODELS
import { SchedulingError } from '../Models/SchedulingError.model';
import { ActivityDesign } from '../Models/ActivityDesign.model';

// CONSTANTS
import { ActivityValueType } from '../Constants/activityValueTypes.constants';
import { activityTimeModes } from '../Constants/activityTimeModes.constants';
import { schedulingAlgorithms } from '../Constants/schedulingAlgorithms.constants';
import { submissionValueTypes } from '../Constants/submissionValueTypes.constants';
import { activityValueStatuses } from '../Constants/activityStatuses.constants';
import { EActivityStatus } from '../Types/ActivityStatus.enum';
import { TActivity } from '../Types/Activity.type';
import { getTimingModeForActivity } from './activities.helpers';
import {
  validateTiming,
  validateValue,
  validateActivityByMandatoryFieldValue,
} from './activityValues.validation';
import {
  schedulingActivity,
  schedulingActivityByFormInstanceId,
} from '../Redux/ActivityScheduling/activityScheduling.actions';

/**
 * @function createSchedulingReturns
 * @description creates an array of scheduling returns from a mapped object
 * @param {Object<SchedulingReturn>} protoReturns the mapped scheduling returns
 */

export const createSchedulingReturns = (protoReturns) => {
  /**
   * ProtoReturns should be formatted as such:
   * ProtoReturns = { [activityId1]: SchedulingReturn1, [activityId2]: SchedulingReturn2 }
   */
  return (Object.keys(protoReturns) || []).map((activityId) => ({
    activityId,
    result: {
      ...protoReturns[activityId],
    },
  }));
};

/**
 * @function determineSchedulingAlgorithmForActivityValue
 * @description determines which scheduling algorithm we need to use for one individual activity
 * @param {Object<ActivityValue>} activityValue the activity value
 * @param {Object<Activity>} activity the whole activity
 */

export const determineSchedulingAlgorithmForActivityValue = (
  activityValue,
  activity,
) => {
  /**
   * Check for timing first
   * timing mode exact === exact algo, otherwise best fit time
   */
  if (activityValue.type === ActivityValueType.TIMING) {
    const timingMode = getTimingModeForActivity(activity);
    if (timingMode === activityTimeModes.EXACT)
      return schedulingAlgorithms.EXACT;
    return schedulingAlgorithms.BEST_FIT_TIME;
  }
  /**
   * Check if submission value was filter,
   * in which case we need to validate if the value we have now is an object or still a filter
   */
  if (activityValue.submissionValueType === submissionValueTypes.FILTER) {
    if (Array.isArray(activityValue.value)) {
      // It's been converted to an object
      return schedulingAlgorithms.EXACT;
    }
    return schedulingAlgorithms.BEST_FIT_OBJECT;
  }

  /**
   * General case is an exact object or a field value, which are both always exact
   */
  return schedulingAlgorithms.EXACT;
};

export const validateActivity = (
  activity: TActivity,
  activityDesign: ActivityDesign,
) => {
  if (_.isEmpty(activity.values)) return false;

  if (!validateActivityByMandatoryFieldValue(activity, activityDesign))
    return false;

  const validationResults = [
    validateTiming(activity),
    ...activity.values.map((activityValue) => validateValue(activityValue)),
  ];
  const hasValidationErrors = validationResults.some(
    (valResult) =>
      valResult.status !== activityValueStatuses.READY_FOR_SCHEDULING,
  );
  return !hasValidationErrors;
};

export const determineSchedulingAlgorithmForActivity = (activity) => {
  const activityValues = [...activity.timing, ...activity.values];
  const allSchedulingAlgorithms = activityValues.map((el) =>
    determineSchedulingAlgorithmForActivityValue(el, activity),
  );
  // Test for exact
  if (
    allSchedulingAlgorithms.every((alg) => alg === schedulingAlgorithms.EXACT)
  ) {
    return schedulingAlgorithms.EXACT;
  }
  // Check if we have props of best fit time and object
  const hasBestFitTime = allSchedulingAlgorithms.some(
    (alg) => alg === schedulingAlgorithms.BEST_FIT_TIME,
  );
  const hasBestFitObject = allSchedulingAlgorithms.some(
    (alg) => alg === schedulingAlgorithms.BEST_FIT_OBJECT,
  );
  if (hasBestFitObject && hasBestFitTime) {
    return schedulingAlgorithms.BEST_FIT_OBJECT_TIME;
  }
  if (hasBestFitTime) return schedulingAlgorithms.BEST_FIT_TIME;
  if (hasBestFitObject) return schedulingAlgorithms.BEST_FIT_OBJECT;
};

export const scheduleActivities = (
  activityIds: string[],
  formId: string,
  coreUserId: number,
  dispatch: any,
) => {
  dispatch(
    schedulingActivity({
      activityIds,
      formId,
      coreUserId,
    }),
  );
};

export const scheduleActivitiesByFormInstanceId = (
  formInstanceId: string,
  formId: string,
  coreUserId: number,
  dispatch: any,
) => {
  dispatch(
    schedulingActivityByFormInstanceId({
      formInstanceId,
      formId,
      coreUserId,
    }),
  );
};

export const updateActivitiesWithSchedulingResults = (
  activities,
  schedulingReturns,
) =>
  activities.map((a) => {
    const response = schedulingReturns.find((r) => r.activityId === a._id);
    if (!response) return a;
    const {
      result: {
        status: activityStatus,
        reservationId,
        errorCode,
        errorMessage,
      },
    } = response;

    const errorDetails =
      activityStatus === EActivityStatus.FAILED
        ? new SchedulingError({
            message: errorMessage,
            code: errorCode,
          })
        : null;
    return {
      ...a,
      activityStatus,
      reservationId,
      errorDetails,
      schedulingTimestamp: moment.utc(),
    };
  });
