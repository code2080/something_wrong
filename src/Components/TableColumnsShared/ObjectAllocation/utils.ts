import { ActivityValueMode } from "Constants/activityValueModes.constants";
import { ActivityValueType } from "Constants/activityValueTypes.constants";
import { TValuesBatchOperation } from "Types/Activity/ActivityBatchOperations.type";

export const createUnsetOperation = (activityIds: string[], typeExtId: string): TValuesBatchOperation[] =>
  activityIds.map((_id) => ({
    _id,
    extId: typeExtId,
    opsType: 'UNSET',
  }));

export const createSetOperation = (
  activityIds: string[],
  typeExtId: string,
  objectExtId: string,
) => {
  const setData: TValuesBatchOperation[] = activityIds.map((_id) => ({
    _id,
    extId: typeExtId,
    opsType: 'SET',
    payload: {
      type: ActivityValueType.OBJECT,
      extId: typeExtId,
      submissionValue: undefined,
      submissionValueType: ActivityValueType.OBJECT,
      valueMode: ActivityValueMode.MANUAL,
      value: [objectExtId],
    },
  }));
  return setData;
};