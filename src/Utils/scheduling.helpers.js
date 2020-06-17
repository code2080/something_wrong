// HELPERS
import { formatActivityForExactScheduling } from './exactScheduling.helpers';
import { validateTiming, validateValue } from './activityValues.validation';
import { getTimingModeForActivity } from './activities.helpers';

// MODELS
import { SchedulingReturn } from '../Models/SchedulingReturn.model';

// CONSTANTS
import { activityValueTypes } from '../Constants/activityValueTypes.constants';
import { mappingTimingModes } from '../Constants/mappingTimingModes.constants';
import { schedulingAlgorithms } from '../Constants/schedulingAlgorithms.constants';
import { submissionValueTypes } from '../Constants/submissionValueTypes.constants';
import {
  activityValueStatuses,
  activityStatuses,
  activityStatusProps
} from '../Constants/activityStatuses.constants';

export const determineSchedulingAlgorithmForActivityValue = (
  activityValue,
  activity
) => {
  /**
   * Check for timing first
   * timing mode exact === exact algo, otherwise best fit time
   */
  if (activityValue.type === activityValueTypes.TIMING) {
    const timingMode = getTimingModeForActivity(activity);
    if (timingMode === mappingTimingModes.EXACT)
      return schedulingAlgorithms.EXACT;
    return schedulingAlgorithms.BEST_FIT_TIME;
  }
  /**
   * Check if submission value was filter,
   * in which case we need to validate if the value we have now is an object or still a filter
   */
  if (activityValue.submissionValueType === submissionValueTypes.FILTER) {
    if (Array.isArray(activityValue.value))
      // It's been converted to an object
      return schedulingAlgorithms.EXACT;
    return schedulingAlgorithms.BEST_FIT_OBJECT;
  }

  /**
   * General case is an exact object or a field value, which are both always exact
   */
  return schedulingAlgorithms.EXACT;
};

const parseTECoreResultToScheduleReturn = teCoreReturn => new SchedulingReturn({
  status:
    teCoreReturn.failures.length === 0
      ? activityStatuses.SCHEDULED
      : activityStatuses.FAILED,
  reservationId: teCoreReturn.newIds[0],
  errorCode: teCoreReturn.failures[0]
    ? teCoreReturn.failures[0].result.references[0]
    : 0,
  errorMessage: teCoreReturn.failures[0]
    ? teCoreReturn.failures[0].result.reservation
    : ''
});

const parseTECoreResultsToScheduleReturns = teCoreReturns =>
  teCoreReturns.map(el => ({
    activityId: el.activityId,
    result: new SchedulingReturn({
      status:
        el.result.reference > 0
          ? activityStatuses.SCHEDULED
          : activityStatuses.FAILED,
      reservationId: el.result.reference > 0 ? el.result.reference : 0,
      errorCode: el.result.reference < 0 ? el.result.reference : '',
      errorMessage: el.result.reference < 0 ? el.result.details : ''
    })
  }));

export const validateActivity = activity => {
  const validationResults = [
    validateTiming(activity),
    ...activity.values.map(activityValue => validateValue(activityValue))
  ];
  const hasValidationErrors = validationResults.some(
    el => el.status !== activityValueStatuses.READY_FOR_SCHEDULING
  );
  if (hasValidationErrors) return false;
  return true;
};

export const determineSchedulingAlgorithmForActivity = activity => {
  const activityValues = [...activity.timing, ...activity.values];
  const allSchedulingAlgorithms = activityValues.map(el =>
    determineSchedulingAlgorithmForActivityValue(el, activity)
  );
  // Test for exact
  if (allSchedulingAlgorithms.every(alg => alg === schedulingAlgorithms.EXACT))
    return schedulingAlgorithms.EXACT;
  // Check if we have props of best fit time and object
  const hasBestFitTime = allSchedulingAlgorithms.some(
    alg => alg === schedulingAlgorithms.BEST_FIT_TIME
  );
  const hasBestFitObject = allSchedulingAlgorithms.some(
    alg => alg === schedulingAlgorithms.BEST_FIT_OBJECT
  );
  if (hasBestFitObject && hasBestFitTime)
    return schedulingAlgorithms.BEST_FIT_OBJECT_TIME;
  if (hasBestFitTime) return schedulingAlgorithms.BEST_FIT_TIME;
  if (hasBestFitObject) return schedulingAlgorithms.BEST_FIT_OBJECT;
};

export const scheduleActivity = (activity, teCoreScheduleFn, callback) => {
  // Validate the activity
  if (!validateActivity(activity))
    return new SchedulingReturn({
      status: activityStatuses.VALIDATION_ERROR,
      errorCode: activityStatuses.VALIDATION_ERROR,
      errorMessage: activityStatusProps[activityStatuses.VALIDATION_ERROR].label
    });
  const schedulingAlgorithm = determineSchedulingAlgorithmForActivity(activity);

  // Special case: EVERTHING is schedulingAlgorithms.EXACT
  if (schedulingAlgorithm === schedulingAlgorithms.EXACT) {
    const reservation = formatActivityForExactScheduling(activity);
    return teCoreScheduleFn({
      reservation,
      callback: teCoreResult =>
        callback(parseTECoreResultToScheduleReturn(teCoreResult))
    });
  }

  return callback(
    new SchedulingReturn({
      status: activityStatuses.FAILED,
      errorCode: activityStatuses.FAILED,
      errorMessage: 'The scheduling algorithm has not yet been implemented'
    })
  );
};

export const scheduleActivities = (activities, teCoreScheduleFn, cFn) => {
  // Preprocess all activities
  const preprocessingMap = activities
    .map(a => {
      const validates = validateActivity(a);
      return {
        activity: a,
        activityId: a._id,
        validates,
        result: validates
          ? null
          : new SchedulingReturn({
            status: activityStatuses.VALIDATION_ERROR,
            errorCode: activityStatuses.VALIDATION_ERROR,
            errorMessage:
              activityStatusProps[activityStatuses.VALIDATION_ERROR].label
          })
      };
    })
    .map(a => {
      if (!a.validates) return a;
      const schedulingAlgorithm = determineSchedulingAlgorithmForActivity(
        a.activity
      );
      return {
        ...a,
        result:
          schedulingAlgorithm === schedulingAlgorithms.EXACT
            ? null
            : new SchedulingReturn({
              status: activityStatuses.FAILED,
              errorCode: activityStatuses.FAILED,
              errorMessage:
                'The scheduling algorithm has not yet been implemented'
            }),
        reservation:
          schedulingAlgorithm === schedulingAlgorithms.EXACT
            ? formatActivityForExactScheduling(a.activity)
            : null
      };
    });

  // Get the ones we're able to schedule
  const toSchedule = preprocessingMap
    .filter(a => a.result == null)
    .map(a => ({ activityId: a.activityId, reservation: a.reservation }));
  const failedActivities = preprocessingMap
    .filter(a => a.result != null)
    .map(a => ({ activityId: a.activityId, result: a.result }));

  if (toSchedule.length === 0) return cFn(failedActivities);

  return teCoreScheduleFn({
    reservations: toSchedule,
    callback: teCoreResults =>
      cFn([
        ...failedActivities,
        ...parseTECoreResultsToScheduleReturns(teCoreResults)
      ])
  });
};
