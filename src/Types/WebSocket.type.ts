export enum ESocketEvents {
  ACTIVITIES_UPDATE = 'ACTIVITIES_UPDATE',
  FILTER_LOOKUP_MAP_UPDATE = 'FILTER_LOOKUP_MAP_UPDATE',
  JOB_UPDATE = 'JOB_UPDATE',
}

export interface IDefaultSocketPayload {
  formId: string;
  status: 'OK' | 'ERROR';
  errorDetails?: string;
  workerStatus?: 'IN_PROGRESS' | 'DONE';
}
