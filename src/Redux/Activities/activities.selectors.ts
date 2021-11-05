import { createSelector } from 'reselect';
import partition from 'lodash/partition';
import { pick } from 'lodash';
import { TActivity } from '../../Types/Activity.type';
import { Activity } from 'Models/Activity.model';
import {
  PopulateSelectionPayload,
  TEObject,
  TEObjectFilter,
} from '../../Types/TECorePayloads.type';
import { extractValuesFromActivityValues } from '../../Utils/activities.helpers';
import { ActivityValue } from '../../Types/ActivityValue.type';
import { ObjectRequest } from '../ObjectRequests/ObjectRequests.types';
import { TFormInstance } from '../../Types/FormInstance.type';
import { ActivitySchedulingState } from 'Redux/ActivityScheduling/activityScheduling.reducer';
import { EActivityStatus } from 'Types/ActivityStatus.enum';

// TYPES
type TActivityMap = {
  [formId: string]: { [formInstanceId: string]: TActivity[] };
};

const activityStateSelector = (state: any): TActivityMap =>
  state.activities || {};
const submissionStateSelector = (state) => state.submissions;

const activitySchedulingStateSelector = (state: any): ActivitySchedulingState =>
  state.activityScheduling;

export const makeSelectActivitiesForForm = () =>
  createSelector(
    activityStateSelector,
    (state) => state.submissions,
    (_: any, formId: string, tableType?: string) => ({ formId, tableType }),
    (
      activities: TActivityMap,
      submissions: { [formId: string]: TFormInstance[] },
      { formId, tableType },
    ) => {
      const activitiesTableId = `${formId}${tableType || ''}`;
      const formSubmissions = submissions?.[formId];
      const formActivities = activities[activitiesTableId] || {};
      return pick(formActivities, [
        ...Object.keys(formSubmissions || {}),
        'null',
      ]);
    },
  );

export const selectActivitiesForForm = ({ formId, tableType }) =>
  createSelector(
    activityStateSelector,
    submissionStateSelector,
    (activity, submission) => {
      const formSubmissions = submission[formId] || {};
      const activitiesTableId = `${formId}${tableType || ''}`;
      return Object.values(activity[activitiesTableId] || {})
        .flat()
        .map((activity: Activity) => {
          activity.updateScopedObject(
            formSubmissions?.[activity.formInstanceId]?.scopedObject,
          );
          return activity as TActivity;
        });
    },
  );

export const makeSelectAllActivityIdsForForm = () =>
  createSelector(
    activityStateSelector,
    (_, formId: string) => formId,
    (activities, formId: string): string[] =>
      activities?.allActivityIds?.[formId] ?? [],
  );

export const makeSelectActivitiesForFormAndIds = () =>
  createSelector(
    activityStateSelector,
    (
      _: any,
      { formId, activityIds }: { formId: string; activityIds: string[] },
    ) => ({ formId, activityIds }),
    (activities, { formId, activityIds }) => {
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
  (activities: TActivityMap) =>
    (formId: string, formInstanceId: string): TActivity[] =>
      activities?.[formId]?.[formInstanceId] ?? [],
);

export const selectActivity = createSelector(
  activityStateSelector,
  (activities: TActivityMap) =>
    (formId: string, formInstanceId: string, activityId: string) => {
      const activitiesForFormInstance: TActivity[] =
        activities?.[formId]?.[formInstanceId] ?? [];
      return activitiesForFormInstance.find((a) => a._id === activityId);
    },
);

const hydrateObjectRequests = (
  valuepayload: Pick<PopulateSelectionPayload, 'objects' | 'fields'>,
  objReqs: ObjectRequest[],
) => {
  const [objFilters, objs]: [any[], any[]] = partition(
    valuepayload.objects,
    (obj) => obj instanceof TEObjectFilter,
  );
  const withObjReqs = {
    ...valuepayload,
    objects: [
      ...(objFilters as TEObjectFilter[]),
      ...(objs as TEObject[]).map((obj) => {
        const objReq = objReqs.find((req: ObjectRequest) => req._id === obj.id);
        return objReq
          ? ({
              ...obj,
              id: objReq?.replacementObjectExtId ?? obj.id,
            } as TEObject)
          : obj;
      }),
    ],
  };
  return withObjReqs;
};

export const selectTECorePayloadForActivity = createSelector(
  (state: any) => state,
  (state) =>
    (
      formId: string,
      formInstanceId: string,
      activityId: string,
      objectRequests: ObjectRequest[],
    ) => {
      const form = state.forms[formId];
      const activitiesForFormInstance = state.activities[formId][
        formInstanceId
      ] as TActivity[];
      const activity = activitiesForFormInstance.find(
        (el) => el._id === activityId,
      );
      if (!activity) return null;

      const activityValues = activity.values || [];
      const valuepayload = extractValuesFromActivityValues(activityValues);
      const withObjReqs = hydrateObjectRequests(valuepayload, objectRequests);
      return {
        ...withObjReqs,
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

export const selectActivityStatus = (actvity: TActivity) =>
  createSelector(activitySchedulingStateSelector, (activityScheduling) => {
    // If in scheduling, return QUEUE
    return activityScheduling.scheduling[actvity._id]
      ? EActivityStatus.QUEUED
      : actvity.activityStatus;
  });
