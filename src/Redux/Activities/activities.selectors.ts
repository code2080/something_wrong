import { createSelector } from 'reselect';
import _ from 'lodash';
import { TActivity } from '../../Types/Activity.type';

// TYPES
type TActivityMap = {
  [key: string]: TActivity[],
};

const activityStateSelector = (state: any): TActivityMap => state.activities;

export const selectActivitiesForForm = createSelector(
  activityStateSelector,
  (activities: TActivityMap) => (formId: string): TActivity[] => activities[formId]
);

export const selectActivitiesForFormAndIds = createSelector(
  activityStateSelector,
  activities => (formId: string, activityIds: string[]) => {
    const activitiesRaw = activities[formId];
    const matchingActivities =
      Object.keys(activitiesRaw).reduce((activities: TActivity[], formInstanceId: string) => {
        const activitiesForFormInstance = activitiesRaw[formInstanceId];
        return [
          ...activities,
          ...activitiesForFormInstance.filter(el => activityIds.indexOf(el._id) > -1)
        ];
      }, []);
    return matchingActivities;
  }
);

export const selectActivitiesForFormInstanceId = createSelector(
  activityStateSelector,
  (activities: TActivityMap) => (formId: string, formInstanceId: string): TActivity[] => _.get(activities, `${formId}.${formInstanceId}`, []),
);

export const selectActivity = createSelector(
  activityStateSelector,
  (activities: TActivityMap) => (formId: string, formInstanceId: string, activityId: string) => {
    const activitiesForFormInstance: TActivity[] = _.get(activities, `${formId}.${formInstanceId}`, []);
    return activitiesForFormInstance.find(a => a._id === activityId);
  }
);

export const selectTECorePayloadForActivity = createSelector(
  (state: any) => state,
  state => (formId, formInstanceId, activityId, _objectRequests) => {
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
    };
  }
);
