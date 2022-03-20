import { EActivityStatus } from "./ActivityStatus.enum";
import { ActivityValue, createFn as createActivityValue } from "./ActivityValue.type"

export type TWeekPatternGroup = {
  _id: string;
  activityIds: string[],
  recipientId: string,
  recipientName: string,
  activityStatuses: EActivityStatus[],
  tagIds: string[],
  weeks: [string, string][],
  timing: ActivityValue[],
  values: ActivityValue[]
}

export const createFn = (obj: any): TWeekPatternGroup => ({
  _id: obj._id,
  activityIds: obj.activityIds || [],
  recipientId: obj.recipientId,
  recipientName: obj.recipientName,
  activityStatuses: obj.activityStatuses || [],
  tagIds: obj.tagIds || [],
  weeks: obj.weeks || [],
  timing: obj.timing,
  values: obj.values.map((obj: any) => createActivityValue(obj)),
});