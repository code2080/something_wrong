import { ActivityValue, createFn as createActivityValue } from "./ActivityValue.type"

export type TWeekPatternGroup = {
  activityIds: string[],
  recipientId: string,
  recipientName: string,
  timing: ActivityValue[],
  values: ActivityValue[]
}

export const createFn = (obj: any): TWeekPatternGroup => ({
  activityIds: obj.activityIds || [],
  recipientId: obj.recipientId,
  recipientName: obj.recipientName,
  timing: obj.timing,
  values: obj.values.map((obj: any) => createActivityValue(obj)),
});