import { EActivityStatus } from './ActivityStatus.enum';

export enum EActivityBatchOperation {
  TAGS = 'TAGS',
  STATUS = 'STATUS',
  SCHEDULE = 'SCHEDULE',
  UNSCHEDULE = 'UNSCHEDULE',
}

export const CActivityBatchOperationURL = {
  [EActivityBatchOperation.TAGS]: 'tags',
  [EActivityBatchOperation.STATUS]: 'status',
  [EActivityBatchOperation.SCHEDULE]: 'schedule',
  [EActivityBatchOperation.UNSCHEDULE]: 'unschedule',
};

export type TActivityBatchOperation = {
  type: EActivityBatchOperation;
  data: Array<
    TTagsBatchOperation | TStatusBatchOperation | TScheduleBatchOperation | TUnscheduleBatchOperation
  >;
  metadata?: any;
};

export type TScheduleBatchOperation = string;
export type TUnscheduleBatchOperation = string;

export type TTagsBatchOperation = {
  _id: string;
  tagId: string | null;
};

export type TStatusBatchOperation = {
  _id: string;
  activityStatus: EActivityStatus;
  errorDetails?: any | undefined | null;
  reservationId?: any | undefined | null;
  schedulingTimestamp?: any | undefined | null;
};
