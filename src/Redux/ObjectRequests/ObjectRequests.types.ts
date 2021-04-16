export interface IndexedObject {
  [key: string]: any;
}

export type OBJET_REQUEST_TYPES =
  | 'NEW_OBJECT'
  | 'MISSING_OBJECT'
  | 'EDIT_OBJECT';

export interface ObjectRequest {
  createdAt: string;
  datasource: string | null;
  formInstanceId: string;
  isActive: boolean;
  objectExtId: string | null;
  objectRequest: IndexedObject;
  organizationId: string;
  replacementObjectExtId: string | null;
  status: string;
  type: OBJET_REQUEST_TYPES;
  updatedAt: string;
  submitter?: string;
  sectionName?: string;
  scopedObject?: string | null;
  _id: string;
}
