import {
  GetExtIdPropsPayload,
  PopulateSelectionPayload,
} from './TECorePayloads.type';

export type TECoreAPI = {
  populateSelection(payload: PopulateSelectionPayload): void;
  getExtIdProps(payload: GetExtIdPropsPayload): any;
  getCurrentUser({
    callback,
  }: {
    callback: (user: { userId: string }) => void;
  }): void;
  getFieldIds({
    typeExtIds,
    callback,
  }: {
    typeExtIds: string[];
    callback: (results: {
      [typeExtId: string]: { [fieldExtId: string]: string };
    }) => void;
  });
  // To be extended
  [apiCall: string]: any;
};
