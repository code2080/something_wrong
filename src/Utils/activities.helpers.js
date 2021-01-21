import _ from 'lodash';

// CONSTANTS
import { activityStatuses } from '../Constants/activityStatuses.constants';
import { teCoreCallnames } from '../Constants/teCoreActions.constants';

// FUNCTIONS
/**
 * @function ensureBackwardsCompatibleActivityDesign
 * @description ensures all activity design is backwards compatible and coered to look lik [[elementPath], [elementPath]]
 * @param {*} activityDesign the activity design to assert
 */
export const ensureBackwardsCompatibleValueRow = valueRow => {
  /**
   * Updating object format to require double arrays to store multiple mappings for each type
   * To ensure compatibility with old forms, we coerce non-double arrays
   */
  if (!valueRow || valueRow == null || !Array.isArray(valueRow)) return [[]];
  if (!valueRow[0] || !Array.isArray(valueRow[0])) return [valueRow];
  return valueRow;
};

export const getTimingModeForActivity = activity => {
  try {
    const aV = activity.timing.find(el => el.extId === 'mode');
    return aV.value;
  } catch (error) {
    return null;
  }
};

/**
 * @function findObjectPathForActivityValue
 * @description finds the path (timing or values) for a value for a certain extId
 * @param {String} valueExtId the extId of the value we're looking for
 * @param {Object} activity the activity with all its values
 * @returns {String} values || timing
 */
export const findObjectPathForActivityValue = (valueExtId, activity) => {
  const timingIdx = activity.timing.findIndex(el => el.extId === valueExtId);
  if (timingIdx > -1) return 'timing';
  const valueIdx = activity.values.findIndex(el => el.extId === valueExtId);
  if (valueIdx > -1) return 'values';
  return null;
};

/**
 * Validates that all activities that is scheduled has existing reservation in core,
 * and sets NOT_SCHEDULED if reservation not found
 * @param {array} activities Activities to validate
 * @param {object} teCoreAPI 
 * @param {object} dispatch 
 */
export const validateScheduledActivities = (activities, teCoreAPI, dispatch) => {
  const reservationIds = activities
  .filter(activity => activity.activityStatus === activityStatuses.SCHEDULED)
  .map(activity => activity.reservationId);

  teCoreAPI[teCoreCallnames.VALIDATE_RESERVATIONS]({
    reservationIds, callback: ({ res: { invalidReservations } }) => {
      const invalidActivityIds = invalidReservations.map(resId => {
        const activityWithInvalidReservation = activities.find(activity => activity.reservationId === resId);
        return activityWithInvalidReservation._id;
      })
      console.log('Found these invalid activities:', invalidActivityIds);
  }})
}

export const activityIsReadOnly = status => [activityStatuses.SCHEDULED, activityStatuses.QUEUED].includes(status);
