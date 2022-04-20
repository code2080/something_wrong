import { TValuesBatchOperation } from 'Types/Activity/ActivityBatchOperations.type';

export const createValuesOperationData = (
  type: 'SET' | 'UNSET',
  activityIds: string[],
  typeExtId: string,
  objectExtId: string,
): TValuesBatchOperation[] =>
  activityIds.map((_id) => ({
    _id,
    extId: typeExtId,
    opsType: type,
    payload: [objectExtId],
  }));
