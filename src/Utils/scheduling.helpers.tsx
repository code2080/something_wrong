import moment from 'moment';
import _ from 'lodash';

// HELPERS
import { formatActivityForExactScheduling } from './exactScheduling.helpers';
import { validateTiming, validateValue } from './activityValues.validation';
import {
  getTimingModeForActivity,
  hydrateObjectRequests,
} from './activities.helpers';

// MODELS
import { SchedulingReturn } from '../Models/SchedulingReturn.model';
import { SchedulingError } from '../Models/SchedulingError.model';

// CONSTANTS
import { ActivityValueType } from '../Constants/activityValueTypes.constants';
import { activityTimeModes } from '../Constants/activityTimeModes.constants';
import { schedulingAlgorithms } from '../Constants/schedulingAlgorithms.constants';
import { submissionValueTypes } from '../Constants/submissionValueTypes.constants';
import {
  activityValueStatuses,
  activityStatuses,
  activityStatusProps,
} from '../Constants/activityStatuses.constants';
import { createJob } from '../Redux/Jobs/jobs.actions';
import { schedulingModes } from '../Constants/schedulingModes.constants';
import { ObjectRequest } from '../Redux/ObjectRequests/ObjectRequests.types';

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

const parseTECoreResultsToScheduleReturns = (teCoreReturns) =>
  teCoreReturns.map((el) => {
    const status =
      el.result.result && el.result.result < 0
        ? activityStatuses.FAILED
        : activityStatuses.SCHEDULED;
    return {
      activityId: el.activityId,
      result: {
        status,
        reservationId:
          status === activityStatuses.SCHEDULED ? el.result.reference : null,
        errorCode: status === activityStatuses.FAILED ? el.result.result : null,
        errorMessage:
          status === activityStatuses.FAILED ? el.result.details : null,
      },
    };
  });

export const validateActivity = (activity) => {
  if (_.isEmpty(activity.values)) return false;
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

/**
 * @function getBindingSchedulingAlgorithm
 * @description determines the binding (ie most complicated) scheduling algorithm in a set of activities
 * @param {Array<Activities>} activities the activities to process
 * @returns schedulingAlgorithm: String
 */
const getBindingSchedulingAlgorithm = (activities) => {
  const schedA = activities.map((a) =>
    determineSchedulingAlgorithmForActivity(a),
  );
  if (schedA.some((a) => a === schedulingAlgorithms.BEST_FIT_OBJECT_TIME)) {
    return schedulingAlgorithms.BEST_FIT_OBJECT_TIME;
  }
  if (schedA.some((a) => a === schedulingAlgorithms.BEST_FIT_OBJECT)) {
    return schedulingAlgorithms.BEST_FIT_OBJECT;
  }
  return schedulingAlgorithms.BEST_FIT_TIME;
};

export const scheduleActivities = (
  activities: any[],
  formType,
  reservationMode,
  teCoreScheduleFn,
  cFn,
  objRequests: ObjectRequest[],
) => {
  // Preprocess all activities

  const preprocessingMap = activities
    .map((a) => {
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
                activityStatusProps[activityStatuses.VALIDATION_ERROR].label,
            }),
      };
    })
    .map((a) => {
      if (!a.validates) return a;
      const schedulingAlgorithm = determineSchedulingAlgorithmForActivity(
        a.activity,
      );
      return {
        ...a,
        schedulingAlgorithm,
        result: null,
        reservation:
          schedulingAlgorithm === schedulingAlgorithms.EXACT
            ? formatActivityForExactScheduling(a.activity)
            : null,
      };
    })
    .map((a) => {
      return hydrateObjectRequests(a, objRequests);
    });
  // filter invalidate activities
  const [noResultActivities, validatedActivities] = _.partition(
    preprocessingMap,
    (activity) => activity.result != null,
  );
  const failedActivities = noResultActivities.map((a) => ({
    activityId: a.activityId,
    result: a.result,
  }));

  if ((failedActivities || []).length > 0) cFn(failedActivities);

  // Edge case: all activities have schedulingAlgorithm EXACT
  if (
    validatedActivities.every(
      (el) => el.schedulingAlgorithm === schedulingAlgorithms.EXACT,
    )
  ) {
    // Get the ones we're able to schedule
    const toSchedule = validatedActivities
      .filter((a) => a.result == null)
      .map((a) => ({ activityId: a.activityId, reservation: a.reservation }));

    if (toSchedule.length === 0) return;

    return teCoreScheduleFn({
      reservations: toSchedule,
      formInfo: {
        formType,
        reservationMode,
      },
      callback: (teCoreResults) =>
        cFn([...parseTECoreResultsToScheduleReturns(teCoreResults)]),
    });
  }
  // General case: start an automated scheduling job
  const a = preprocessingMap.filter((a) => a.validates).map((a) => a.activity);
  return (
    a.length &&
    (window as any).tePrefsLibStore.dispatch(
      createJob({
        activities: a,
        type: getBindingSchedulingAlgorithm(a),
        formId: a[0].formId,
        formInstanceIds: a.map((a) => a.formInstanceId),
        callback: cFn,
        meta: { schedulingMode: schedulingModes.MULTIPLE },
      }),
    )
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
      activityStatus === activityStatuses.FAILED
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
