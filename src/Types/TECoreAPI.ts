import {
  GetExtIdPropsPayload,
  PopulateSelectionPayload,
} from './TECorePayloads.type';

export type TECoreAPI = {
  populateSelection(payload: PopulateSelectionPayload): void;
  getExtIdProps(payload: GetExtIdPropsPayload): any;
  getCurrentUser({ callback }: { callback: (user: string) => void }): void;
  // To be extended
  [apiCall: string]: any;
};
