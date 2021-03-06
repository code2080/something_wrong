export enum ActivityValueType {
  OBJECT = 'object',
  FILTER = 'filter',
  FIELD = 'field',
  TIMING = 'timing',
  OTHER = 'other',
}

export const activityValueTypeProps = {
  [ActivityValueType.OBJECT]: {
    path: 'objects',
  },
  [ActivityValueType.FIELD]: {
    path: 'fields',
  },
  [ActivityValueType.TIMING]: {
    path: 'timing',
  },
};
