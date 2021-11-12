import { difference, isEmpty } from 'lodash';
import { createSelector } from 'reselect';
import { TActivity } from 'Types/Activity.type';
import { ActivitySchedulingState } from './activityScheduling.reducer';

const activitySchedulingStateSelector = (state: {
  activityScheduling: ActivitySchedulingState;
}): ActivitySchedulingState => state.activityScheduling;

const activityStateSelector = (state: any) => state.activities || {};

export const selectActivityScheduling = () =>
  createSelector(
    activitySchedulingStateSelector,
    (activityScheduling) => activityScheduling.scheduling,
  );
export const selectActivitySchedulingById = (activityId: string) =>
  createSelector(
    activitySchedulingStateSelector,
    (activityScheduling) => activityScheduling.scheduling[activityId],
  );
export const selectAllActivitiesAreScheduling = (formId: string) =>
  createSelector(
    activitySchedulingStateSelector,
    activityStateSelector,
    (activityScheduling, activity) => {
      // TODO: SSP: This doesnt work with SSP
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

export const makeSelectAllActivityIds = () => {
  createSelector(
    activityStateSelector,
    (_: any, formId: string) => formId,
    (uiState, formId) => uiState.paginationParams[formId] || {},
  );
};

export const makeSelectAllActivityIdsForForm = () =>
  createSelector(
    activityStateSelector,
    (_: any, formId: string) => formId,
    (activities, formId: string) => activities?.byFormId?.[formId] ?? [],
  );

export const makeSelectAllActivityidsForForminstance = () =>
  createSelector(
    activityStateSelector,
    (_: any, formId: string, formInstanceId: string) => ({
      formId,
      formInstanceId,
    }),
    (activities, { formId, formInstanceId }) =>
      activities?.byFormInstanceId?.[formId]?.[formInstanceId] ?? [],
  );
