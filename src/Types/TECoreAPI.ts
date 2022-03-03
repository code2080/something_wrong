import {
  TGetExtIdPropsPayload,
  PopulateSelectionPayload,
} from './TECorePayloads.type';

export type getFieldIdsReturn = {
  [typeExtId: string]: { [fieldExtId: string]: string };
};

export type getRelatedGroupsReturn = {
  [objectExtId: string]: [objectExtId: string];
};

export type TECoreAPI = {
  populateSelection(payload: PopulateSelectionPayload): void;
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
    reservationData: PopulateSelectionPayload;
    callback: (reservationIds: string[]) => void;
  }): void;
  getRelatedGroups({
    objectIds,
    typeId,
  }: {
    objectIds: string[];
    typeId: string;
  }): string[];
  // To be extended
  [apiCall: string]: any;
};
