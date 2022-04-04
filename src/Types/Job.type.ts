export enum EJobGroupings {
  FLAT = 'FLAT',
}

export enum EJobStatus {
  NOT_STARTED = 'NOT_STARTED',
  STARTED = 'STARTED',
  FAILED = 'FAILED',
  FINISHED = 'FINISHED',
  SCHEDULED = 'SCHEDULED',
  ABORTED = 'ABORTED',
}

export const CJobStatus = {
  [EJobStatus.NOT_STARTED]: {
    color: 'default',
    label: 'Queued',
  },
  [EJobStatus.STARTED]: {
    color: 'info',
    label: 'In progress',
  },
  [EJobStatus.FAILED]: {
    color: 'attention',
    label: 'Failed',
  },
  [EJobStatus.FINISHED]: {
    color: 'success',
    label: 'Completed',
  },
  [EJobStatus.SCHEDULED]: {
    color: 'success',
    label: 'Wrapping up',
  },
  [EJobStatus.ABORTED]: {
    color: 'attention',
    label: 'Aborted',
  },
};

export type TJob = {
  _id: string;
  status: EJobStatus;
  noOfActivities: number;
  createdAt: string;
  formId: string;
  formPeriod: [string, string];
  reservationMode: string;
  constraintProfileId: string;
  constraintProfileName: string;
  tagNames: string[];
};

export const createFn = (obj: any): TJob => ({
  _id: obj._id,
  status: obj.status,
  noOfActivities: obj.noOfActivities || 0,
  createdAt: obj.createdAt,
  formId: obj.formId,
  formPeriod: obj.formId,
  reservationMode: obj.reservationMode,
  constraintProfileId: obj.constraintProfileId,
  constraintProfileName: obj.constraintProfileName,
  tagNames: obj.tagNames,
});
