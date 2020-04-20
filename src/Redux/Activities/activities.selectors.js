import createSelector from 'reselect';

const activityStateSelector = state => state.activities;

export const selectActivitiesForForm = createSelector(
  activityStateSelector,
  activities => formId => activities[formId]
);

export const selectActivitiesForFormInstanceId = createSelector(
  selectActivitiesForForm,
  activities => formInstanceId => activities[formInstanceId]
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
    } catch {
      return null;
    }
  }
);
