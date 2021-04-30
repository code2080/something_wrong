import { createSelector } from 'reselect';
import _ from 'lodash';
import { TActivity } from '../../Types/Activity.type';
import { PopulateSelectionPayload } from '../../Types/TECorePayloads.type';
import { extractValuesFromActivityValues } from '../../Utils/activities.helpers';
import { ActivityValue } from '../../Types/ActivityValue.type';

// TYPES
type TActivityMap = {
  [formId: string]: TActivity[];
};

const activityStateSelector = (state: any): TActivityMap =>
  state.activities || {};

export const makeSelectActivitiesForForm = () =>
  createSelector(
    activityStateSelector,
    (_: any, formId: string) => formId,
    (activities: TActivityMap, formId: string): TActivity[] =>
      activities[formId] || [],
  );

export const selectActivitiesForFormAndIds = createSelector(
  activityStateSelector,
  (activities) => (formId: string, activityIds: string[]) => {
    const activitiesRaw = activities[formId] || {};
    const matchingActivities = Object.keys(activitiesRaw).reduce(
      (activities: TActivity[], formInstanceId: string) => {
        const activitiesForFormInstance = activitiesRaw[formInstanceId];
        return [
          ...activities,
          ...activitiesForFormInstance.filter((act: TActivity) =>
            activityIds.includes(act._id),
          ),
        ];
      },
      [],
    );
    return matchingActivities;
  },
);

export const selectActivitiesForFormInstanceId = createSelector(
  activityStateSelector,
  (activities: TActivityMap) => (
    formId: string,
    formInstanceId: string,
  ): TActivity[] => _.get(activities, `${formId}.${formInstanceId}`, []),
);

export const selectActivity = createSelector(
  activityStateSelector,
  (activities: TActivityMap) => (
    formId: string,
    formInstanceId: string,
    activityId: string,
  ) => {
    const activitiesForFormInstance: TActivity[] = _.get(
      activities,
      `${formId}.${formInstanceId}`,
      [],
    );
    return activitiesForFormInstance.find((a) => a._id === activityId);
  },
);

export const selectTECorePayloadForActivity = createSelector(
  (state: any) => state,
  (state) => (formId, formInstanceId, activityId, _objectRequests) => {
    const form = state.forms[formId];
    const activitiesForFormInstance = state.activities[formId][formInstanceId];
    const activity = activitiesForFormInstance.find(
      (el) => el._id === activityId,
    ) as TActivity;
    if (!activity) return null;

    const activityValues = activity.values || [];
    const valuepayload = extractValuesFromActivityValues(activityValues);

    return {
      ...valuepayload,
      reservationMode: form.reservationMode,
      formType: form.formType,
      startTime: activity.timing.find(
        (act: ActivityValue) => act?.extId === 'startTime',
      )?.value as string,
      endTime: activity.timing.find(
        (act: ActivityValue) => act?.extId === 'endTime',
      )?.value as string,
    } as PopulateSelectionPayload;
  },
);
