import {
  GetExtIdPropsPayload,
  PopulateSelectionPayload,
} from './TECorePayloads.type';

export type TECoreAPI = {
  populateSelection(payload: PopulateSelectionPayload): void;
  getExtIdProps(payload: GetExtIdPropsPayload): any;
  getCurrentUser({ callback }: { callback: (user: string) => void }): void;
  getFieldIdsFromObjects(
    objectIds: string[],
  ): { [objectExtId: string]: { [fieldExtId: string]: string } };
  // To be extended
  [apiCall: string]: any;
};
