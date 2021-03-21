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

export type ValueType =
  | string
  | number
  | string[]
  | number[]
  | CategoryField
  | undefined
  | null;

export type ActivityValue = {
  type: ActivityValueType;
  extId: string;
  submissionValue: ValueType | null;
  submissionValueType: ActivityValueType;
  valueMode: ActivityValueMode;
  value: any;
  sectionId?: string | null;
  elementId?: string | null;
  eventId?: string | null;
  rowIdx?: number | null;
};
