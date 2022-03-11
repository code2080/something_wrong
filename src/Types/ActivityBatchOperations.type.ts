import { EActivityStatus } from "./ActivityStatus.enum";

export enum EActivityBatchOperation {
  TAGS = 'TAGS',
  STATUS = 'STATUS',
};

export const CActivityBatchOperationURL = {
  [EActivityBatchOperation.TAGS]: 'tags',
  [EActivityBatchOperation.STATUS]: 'status'
}

export type TActivityBatchOperation = {
  type: EActivityBatchOperation,
  data: Array<TTagsBatchOperation | TStatusBatchOperation>,
};

export type TTagsBatchOperation = {
  _id: string;
  tagId: string | null;
};

export type TStatusBatchOperation = {
  _id: string,
  activityStatus: EActivityStatus,
  errorDetails?: any | undefined | null,
  reservationId?: any | undefined | null,
}