import { createSelector } from 'reselect';
import _ from 'lodash';

const activityStateSelector = state => state.activities;

export const selectActivitiesForForm = createSelector(
  activityStateSelector,
  activities => formId => activities[formId]
);

export const selectActivitiesForFormInstanceId = createSelector(
  activityStateSelector,
  activities => (formId, formInstanceId) => _.get(activities, `${formId}.${formInstanceId}`, []),
);

export const selectActivity = createSelector(
  selectActivitiesForFormInstanceId,
  activities => activityId => activities.find(a => a._id === activityId)
);

export const selectTimingModeForActivity = createSelector(
  selectActivity,
  activity => {
    try {
      const activityValue = activity.timing.find(el => el.extId === 'mode');
      return activityValue.value;
    } catch (e) {
      return null;
    }
  }
);

export const selectTECorePayloadForActivity = createSelector(
  state => state,
  state => (formId, formInstanceId, activityId, objectRequests) => {
    const form = state.forms[formId];
    const activitiesForFormInstance = state.activities[formId][formInstanceId];
    const activity = activitiesForFormInstance.find(el => el._id === activityId);
    if (!activity) return null;

    // Find start time and end time
    const startTime = activity.timing.find(el => el.extId === 'startTime');
    const endTime = activity.timing.find(el => el.extId === 'endTime');
    const typedObjects = (activity.values || []).map(aV => aV.value);
    return {
      startTime,
      endTime,
      typedObjects,
      formType: form.formType,
      reservationMode: form.reservationMode,
    }
  }
);
