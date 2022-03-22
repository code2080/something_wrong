import { EActivityStatus } from "./ActivityStatus.enum";

export enum EActivityBatchOperation {
  TAGS = 'TAGS',
  STATUS = 'STATUS',
  SCHEDULE = 'SCHEDULE',
};

export const CActivityBatchOperationURL = {
  [EActivityBatchOperation.TAGS]: 'tags',
  [EActivityBatchOperation.STATUS]: 'status',
  [EActivityBatchOperation.SCHEDULE]: 'schedule'
}

export type TActivityBatchOperation = {
  type: EActivityBatchOperation,
  data: Array<TTagsBatchOperation | TStatusBatchOperation | TScheduleBatchOperation>,
  metadata?: any;
};

export type TScheduleBatchOperation = string;

export type TTagsBatchOperation = {
  _id: string;
  tagId: string | null;
};

export type TStatusBatchOperation = {
  _id: string,
  activityStatus: EActivityStatus,
  errorDetails?: any | undefined | null,
  reservationId?: any | undefined | null,
  schedulingTimestamp?: any | undefined | null,
}