import { difference, isEmpty } from 'lodash';
import { createSelector } from 'reselect';
import { TActivity } from 'Types/Activity.type';
import { ActivitySchedulingState } from './activityScheduling.reducer';

const stateSelector = (state): ActivitySchedulingState =>
  state.activityScheduling;
const activityStateSelector = (state) => state.activities;

export const selectActivityScheduling = () =>
  createSelector(
    stateSelector,
    (activityScheduling) => activityScheduling.scheduling,
  );
export const selectActivitySchedulingById = (activityId: string) =>
  createSelector(
    stateSelector,
    (activityScheduling) => activityScheduling.scheduling[activityId],
  );
export const selectAllActivitiesAreScheduling = (formId: string) =>
  createSelector(
    stateSelector,
    activityStateSelector,
    (activityScheduling, activity) => {
      // TODO: This doesnt work with SSP
      const activities = activity[formId];
      if (!activities) return false;

      const allActivityIds = Object.values(activities).flatMap((acts) =>
        (acts as TActivity[]).map((act) => act._id),
      );
      if (isEmpty(allActivityIds)) return false;

      const schedulingActivityIds = Object.keys(
        activityScheduling.scheduling,
      ).filter((key) => activityScheduling.scheduling[key]);
      return isEmpty(difference(allActivityIds, schedulingActivityIds));
    },
  );
