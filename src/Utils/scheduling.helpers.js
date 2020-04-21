// HELPERS
import { scheduleActivityExact } from './exactScheduling.helpers';
import { validateTiming, validateValue } from './activityValues.validation';
import { getTimingModeForActivity } from './activities.helpers';

// MODELS
import { SchedulingReturn } from '../Models/SchedulingReturn.model';

// CONSTANTS
import { activityValueTypes } from '../Constants/activityValueTypes.constants';
import { mappingTimingModes } from '../Constants/mappingTimingModes.constants';
import { schedulingAlgorithms } from '../Constants/schedulingAlgorithms.constants';
import { submissionValueTypes } from '../Constants/submissionValueTypes.constants';
import { activityValueStatuses, activityStatuses, activityStatusProps } from '../Constants/activityStatuses.constants';

export const determineSchedulingAlgorithmForActivityValue = (activityValue, activity) => {
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

export const scheduleActivity = (activity, teCoreScheduleFn, callback) => {
  /**
   * Validate the timing, values activity values
   */
  const validationResults = [
    validateTiming(activity),
    ...activity.values.map(activityValue => validateValue(activityValue)),
  ];
  const hasValidationErrors = validationResults.some(el => el.status !== activityValueStatuses.READY_FOR_SCHEDULING);
  if (hasValidationErrors)
    return callback(new SchedulingReturn({
      status: activityStatuses.VALIDATION_ERROR,
      errorCode: activityStatuses.VALIDATION_ERROR,
      errorMessage: activityStatusProps[activityStatuses.VALIDATION_ERROR].label,
    }));

  /**
   * Get the scheduling algorithms for all activity values
   */
  const activityValues = [...activity.timing, ...activity.values];
  const allSchedulingAlgorithms = activityValues.map(el => determineSchedulingAlgorithmForActivityValue(el, activity));

  // Special case: EVERTHING is schedulingAlgorithms.EXACT
  if (allSchedulingAlgorithms.every(alg => alg === schedulingAlgorithms.EXACT))
    return scheduleActivityExact(activity, teCoreScheduleFn, callback);

  return callback(new SchedulingReturn({
    status: activityStatuses.FAILED,
    errorCode: activityStatuses.FAILED,
    errorMessage: 'The scheduling algorithm has not yet been implemented',
  }));
}
