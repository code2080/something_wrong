import { Socket } from "socket.io-client";
import { DefaultEventsMap } from '@socket.io/component-emitter';

export const WEBSOCKET_UPDATE = 'WEBSOCKET_UPDATE';

export enum ESocketEvent {
  ACTIVITY_GENERATION_UPDATE = 'ACTIVITY_GENERATION_UPDATE',
  ACTIVITY_BATCH_OPERATION_UPDATE = 'ACTIVITY_BATCH_OPERATION_UPDATE',
  FILTER_LOOKUP_MAP_UPDATE = 'FILTER_LOOKUP_MAP_UPDATE',
  JOB_UPDATE = 'JOB_UPDATE',
}

export interface IDefaultSocketPayload {
  formId: string;
  type: ESocketEvent;
  data: {
    status: 'OK' | 'ERROR';
    errorDetails?: string;
    workerStatus?: 'IN_PROGRESS' | 'DONE';
  }
}

export type TSocketEventMap = Record<ESocketEvent, (payload: IDefaultSocketPayload) => void>;

export interface ISocketContext {
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined;
  setEventMap: (eventMap: TSocketEventMap) => void;
  setFormId: (formId: string | undefined) => void;
}