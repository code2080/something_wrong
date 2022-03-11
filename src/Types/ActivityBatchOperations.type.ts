/* eslint-disable no-shadow */
export enum EActivityBatchOperation {
  TAGS = 'TAGS',
  SCHEDULING_STATUS = 'SCHEDULING_STATUS',
};

export type TActivityBatchOperation = {
  type: EActivityBatchOperation,
  data: TTagsBatchOperation[],
};

export type TTagsBatchOperation = {
  _id: string;
  tagId: string | null;
};

export const createFn = (type: EActivityBatchOperation, data: any[]): TActivityBatchOperation => ({
  type,
  data
});