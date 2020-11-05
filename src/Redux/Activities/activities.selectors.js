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
