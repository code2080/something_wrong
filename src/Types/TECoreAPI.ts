import { TCreateObjectsRequestPayload } from './GroupManagement.type';
import {
  TGetExtIdPropsPayload,
  TPopulateSelectionPayload,
} from './TECorePayloads.type';

export type getFieldIdsReturn = {
  [typeExtId: string]: { [fieldExtId: string]: string };
};

export type getRelatedGroupsReturn = {
  [objectExtId: string]: [objectExtId: string];
};

export type TECoreAPI = {
  populateSelection(payload: TPopulateSelectionPayload): void;
  getExtIdProps(payload: TGetExtIdPropsPayload): any;
  getCurrentUser({
    callback,
  }: {
    callback: (user: { userId: string }) => void;
  }): void;

  getFieldIds({
    typeExtIds,
    integerFieldsOnly,
    callback,
  }: {
    typeExtIds: string[];
    integerFieldsOnly?: boolean;
    callback: (results: getFieldIdsReturn) => void;
  }): void;
  requestManuallyScheduleActivity({
    reservationData,
    callback,
  }: {
    reservationData: TPopulateSelectionPayload;
    callback: (reservationIds: string[]) => void;
  }): void;
  getRelatedGroups({
    objectIds,
    typeId,
  }: {
    objectIds: string[];
    typeId: string;
  }): string[];
  requestCreateObjects: (args: TCreateObjectsRequestPayload[], callback: (args: any) => void) => void;
  selectReservation: ({reservationId: string}) => void;
  /**
   * CATCH ALL
   */
  [apiCall: string]: any;
};
