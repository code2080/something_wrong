import _ from 'lodash';
import { Activity } from '../../Models/Activity.model';

// HELPERS
import {
  getTimingModeForActivity,
  findObjectPathForActivityValue,
} from '../../Utils/activities.helpers';

// CONSTANTS
import { ActivityValueMode } from '../../Constants/activityValueModes.constants';
import { activityTimeModes } from '../../Constants/activityTimeModes.constants';
import { getActivityValuesBasedOnElement } from '../../Utils/ActivityValues/helpers';

/**
 * @function updateActivitiesForForm
 * @description creates an updated state for the formIds activities
 * @param {Activity[]} activities
 * @param {[formInstanceId: string]: Activity[]}
 * @returns {Object} updatedFormState
 */
export const updateActivitiesForForm = (
  activities,
  sections,
  activitiesInStore = {},
) =>
  activities
    .map(
      (el, idx) =>
        new Activity({
          ...el,
          sequenceIdx: el.sequenceIdx ?? idx,
          values: getActivityValuesBasedOnElement(el.values, sections),
        }),
    )
    .reduce(
      (_activities, activity) => ({
        ..._activities,
        [activity.formInstanceId]: [
          ...(_activities[activity.formInstanceId] || []),
          activity,
        ],
      }),
      activitiesInStore,
    );

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
 * @function updateActivityWithNewValue
 * @description returns a new activity with an updated activity value
 * @param {Object} newActivityValue the new activity value object
 * @param {Object} activity the original activity
 * @param {String} objPath the path to mutate (timing, values)
 * @returns {Object} updated activity
 */
const updateActivityWithNewValue = (newActivityValue, activity, objPath) => {
  const valueIdx = activity[objPath].findIndex(
    (el) =>
      el.extId === newActivityValue.extId &&
      el.submissionValue === newActivityValue.submissionValue,
  );
  if (valueIdx === -1) return null;
  return {
    ...activity,
    [objPath]: [
      ...activity[objPath].slice(0, valueIdx),
      { ...newActivityValue },
      ...activity[objPath].slice(valueIdx + 1),
    ],
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
    valueMode: ActivityValueMode.MANUAL,
  };
  const objPath = findObjectPathForActivityValue(
    newActivityValue.extId,
    activity,
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
  const updatedActivity = activity;
  newValue.forEach((value) => {
    const objPath = findObjectPathForActivityValue(value.extId, activity);
    const activityValueIdx = activity[objPath].findIndex(
      (el) => el.extId === value.extId,
    );
    updatedActivity[objPath] = [
      ...updatedActivity[objPath].slice(0, activityValueIdx),
      {
        ...activity[objPath][activityValueIdx],
        value: value.value,
        valueMode: ActivityValueMode.MANUAL,
      },
      ...updatedActivity[objPath].slice(activityValueIdx + 1),
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
  activity,
) => {
  /**
   * All props only affect themselves, except for certain timing changes
   */
  const timingMode = getTimingModeForActivity(activity);
  if (
    timingMode !== activityTimeModes.EXACT &&
    (activityValue.extId === 'startTime' || activityValue.extId === 'endTime')
  ) {
    return updateMultipleActivityValues(newValue, activityValue, activity);
  }

  return updateSingleActivityValue(newValue, activityValue, activity);
};

const revertMultipleActivityValues = (extIds, activity) => {
  const updatedActivity = activity;
  extIds.forEach((extId) => {
    const objPath = findObjectPathForActivityValue(extId, activity);
    const activityValueIdx = activity[objPath].findIndex(
      (el) => el.extId === extId,
    );
    updatedActivity[objPath] = [
      ...updatedActivity[objPath].slice(0, activityValueIdx),
      {
        ...activity[objPath][activityValueIdx],
        value: activity[objPath][activityValueIdx].submissionValue[0],
        valueMode: ActivityValueMode.FROM_SUBMISSION,
      },
      ...updatedActivity[objPath].slice(activityValueIdx + 1),
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
  const { extId, submissionValue } = activityValue;
  const timingMode = getTimingModeForActivity(activity);
  if (
    timingMode === activityTimeModes.EXACT &&
    (extId === 'startTime' || extId === 'endTime')
  ) {
    return revertMultipleActivityValues(['startTime', 'endTime'], activity);
  } else {
    return updateActivityWithNewValue(
      {
        ...activityValue,
        valueMode: ActivityValueMode.FROM_SUBMISSION,
        value: submissionValue,
      },
      activity,
      findObjectPathForActivityValue(extId, activity),
    );
  }
};
