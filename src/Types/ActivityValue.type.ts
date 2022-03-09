import { ActivityValueMode } from '../Constants/activityValueModes.constants';
import { ActivityValueType } from '../Constants/activityValueTypes.constants';

export type CategoryField = {
  searchString: string | null;
  searchFields: string | null;
  categories: [
    {
      id: string;
      values: string[];
    },
  ];
};

export type DateRangeValue = {
  startTime: string;
  endTime: string;
};
export type PaddingValue = {
  before: number;
  after: number;
};

export type ValueType =
  | string
  | number
  | string[]
  | number[]
  | CategoryField
  | DateRangeValue
  | PaddingValue
  | null;

export type ActivityValue = {
  type: ActivityValueType;
  extId: string;
  submissionValue?: ValueType;
  submissionValueType: ActivityValueType;
  valueMode: ActivityValueMode;
  value?: ValueType;
  sectionId?: string | null;
  elementId?: string | null;
  eventId?: string | null;
  rowIdx?: number | null;
  isAllocated?: boolean;
};

export type IndexedActivityValueType = {
  [extId: string]: null | ActivityValue[];
};

export const createFn = (obj: any) => ({
  type: obj.type,
  extId: obj.extId,
  submissionValue: obj.submissionValue || undefined,
  submissionValueType: obj.submissionValueType || undefined,
  valueMode: obj.valueMode || undefined,
  value: obj.value || undefined,
  sectionId: obj.sectionId || undefined,
  elementId: obj.elementId || undefined,
  eventId: obj.eventId || undefined,
  rowIdx: obj.rowIdx,
  isAllocated: obj.isAllocated || undefined,
});
