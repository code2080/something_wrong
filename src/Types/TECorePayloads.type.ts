import { ValueType } from './Activity/ActivityValue.type';

export class TEField {
  fieldExtId: string;
  values: string[];
  constructor(fieldExtId: string, values: string[]) {
    this.fieldExtId = fieldExtId;
    this.values = values;
  }
}

export class TEObjectFilter {
  type: string;
  fields: TEField[];
  constructor(type: string, fields: TEField[]) {
    this.type = type;
    this.fields = fields;
  }
}

export class TEObject {
  type: string;
  id: string;
  constructor(type: string, id: string) {
    this.type = type;
    this.id = id;
  }
}

export type TPopulateSelectionPayload = {
  objects: (TEObject | TEObjectFilter)[];
  fields: TEField[];
  formType: 'REGULAR' | 'AVAILABILITY';
  reservationMode: string;
  startTime?: ValueType;
  endTime?: ValueType;
};

export type TGetExtIdPropsPayload = {
  objects: (TEObject | string)[];
  fields: string[];
  types: string[];
};
