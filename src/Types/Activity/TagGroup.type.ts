import { EActivityStatus } from './ActivityStatus.enum';

export type TTagGroup = {
  _id: string;
  tagName: string;
  activityIds: string[];
  activityStatuses: EActivityStatus[];
  noOfActivities: number;
  noOfActivitiesScheduled: number;
  noOfActivitiesFailed: number;
  noOfActivitiesUnscheduled: number;
};

export const createFn = (obj: any): TTagGroup => ({
  _id: obj._id,
  tagName: obj.tagName,
  activityIds: obj.activityIds || [],
  activityStatuses: obj.activityStatuses || [],
  noOfActivities: obj.noOfActivities,
  noOfActivitiesScheduled: obj.noOfActivitiesScheduled,
  noOfActivitiesFailed: obj.noOfActivitiesFailed,
  noOfActivitiesUnscheduled:
    obj.noOfActivities - obj.noOfActivitiesScheduled - obj.noOfActivitiesFailed,
});
