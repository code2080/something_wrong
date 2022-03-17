import { EActivityStatus } from './ActivityStatus.enum';

export type TActivityFilterLookupMap = {
  submitter: Record<string, number>;
  tag: Record<string, number>;
  primaryObject: Record<string, number>;
  objects: Record<string, Record<string, number>>;
  fields: Record<string, Record<string | number, number>>;
  objectFilters: Record<
    string,
    Record<string, Record<string | number, number>>
  >;
  startTime: Record<string, number>;
  endTime: Record<string, number>;
  startDate: Record<string, number>;
  endDate: Record<string, number>;
};

export type TActivityFilter = {
  date?: [string, string];
  time?: [string, string];
  status?: EActivityStatus[];
  submitter?: string[];
  tag?: string[];
  primaryObject?: string[];
  objects?: Record<string, string[]>;
  fields?: Record<string, string[]>;
  objectFilters?: Record<string, Record<string, string[]>>;
  startTime?: string[];
  endTime?: string[];
  startDate?: string[];
  endDate?: string[];
};

export interface TActivityFilterMapObject {
  /** An entry will either be a leaf (string array) or a nested object */
  [key: string]: string[] | TActivityFilterMapObject;
}

export const createFn = (obj: any) => ({
  submitter: obj.submitterName || {}, // hacky
  tag: obj.tag || {},
  primaryObject: obj.primaryObject || {},
  objects: obj.objects || {},
  fields: obj.fields || {},
  objectFilters: obj.objectFilters || {},
  startTime: obj.startTime || {},
  endTime: obj.endTime || {},
  startDate: obj.startDate || {},
  endDate: obj.endDate || {},
});
