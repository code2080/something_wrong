import moment from 'moment';
import _ from 'lodash';

// HELPERS
import { ActivityValueValidation } from 'Types/ActivityValueValidation.type';
import { SchedulingReturn } from '../Models/SchedulingReturn.model';

// MODELS
import { SchedulingError } from '../Models/SchedulingError.model';
import { ActivityDesign } from '../Models/ActivityDesign.model';

// CONSTANTS
import { ActivityValueType } from '../Constants/activityValueTypes.constants';
import { activityTimeModes } from '../Constants/activityTimeModes.constants';
import { schedulingAlgorithms } from '../Constants/schedulingAlgorithms.constants';
import { submissionValueTypes } from '../Constants/submissionValueTypes.constants';
import {
  activityValueStatuses,
  activityStatusProps,
} from '../Constants/activityStatuses.constants';
import { EActivityStatus } from '../Types/ActivityStatus.enum';
import { createJob } from '../Redux/Jobs/jobs.actions';
import { schedulingModes } from '../Constants/schedulingModes.constants';
import { ObjectRequest } from '../Redux/ObjectRequests/ObjectRequests.types';
import { TActivity } from '../Types/Activity.type';
import {
  getTimingModeForActivity,
  hydrateObjectRequests,
} from './activities.helpers';
import {
  validateTiming,
  validateValue,
  validateActivityByMandatoryFieldValue,
} from './activityValues.validation';
import { formatActivityForExactScheduling } from './exactScheduling.helpers';

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
        ? EActivityStatus.FAILED
        : EActivityStatus.SCHEDULED;
    return {
      activityId: el.activityId,
      result: {
        status,
        reservationId:
          status === EActivityStatus.SCHEDULED ? el.result.reference : null,
        errorCode: status === EActivityStatus.FAILED ? el.result.result : null,
        errorMessage:
          status === EActivityStatus.FAILED ? el.result.details : null,
      },
    };
  });

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

/**
 * @function getBindingSchedulingAlgorithm
 * @description determines the binding (ie most complicated) scheduling algorithm in a set of activities
 * @param {Array<Activities>} activities the activities to process
 * @returns schedulingAlgorithm: String
 */
const getBindingSchedulingAlgorithm = (activities: TActivity[]): string => {
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
  activities: TActivity[],
  formType: string,
  reservationMode: string,
  teCoreScheduleFn,
  cFn: (result: ActivityValueValidation[]) => void,
  objRequests: ObjectRequest[],
  activityDesign?: ActivityDesign,
  isBeta = false,
) => {
  // Preprocess all activities
  const preprocessingMap = activities
    .map((a) => {
      const validates = validateActivity(a, activityDesign);
      return {
        activity: hydrateObjectRequests(a, objRequests) as TActivity,
        activityId: a._id,
        validates,
        result: validates
          ? null
          : new SchedulingReturn({
              status: EActivityStatus.VALIDATION_ERROR,
              errorCode: EActivityStatus.VALIDATION_ERROR,
              errorMessage:
                activityStatusProps[EActivityStatus.VALIDATION_ERROR]?.label ??
                EActivityStatus.VALIDATION_ERROR,
            }),
      };
    })
    .map((a) => {
      if (!a.validates)
        return { ...a, schedulingAlgorithm: null, reservation: null };
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
    // Feature flag: DEV-468
    !isBeta &&
    validatedActivities.every(
      (el) => el.schedulingAlgorithm === schedulingAlgorithms.EXACT,
    )
  ) {
    // Get the ones we're able to schedule
    const toSchedule = validatedActivities
      .filter((a) => a.result == null)
      .map((a) => ({ activityId: a.activityId, reservation: a.reservation }));

    if (toSchedule.length === 0) return [];

    teCoreScheduleFn({
      reservations: toSchedule,
      formInfo: {
        formType,
        reservationMode,
      },
      callback: (teCoreResults) =>
        cFn([...parseTECoreResultsToScheduleReturns(teCoreResults)]),
    });
    return toSchedule;
  }
  // General case: start an automated scheduling job
  const a = preprocessingMap.filter((a) => a.validates).map((a) => a.activity);
  if (a.length) {
    (window as any).tePrefsLibStore.dispatch(
      createJob({
        activities: a,
        type: getBindingSchedulingAlgorithm(a),
        formId: a[0].formId,
        formInstanceIds: a.map((a) => a.formInstanceId),
        callback: cFn,
        meta: { schedulingMode: schedulingModes.MULTIPLE },
      }),
    );
  }
  return a;
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
