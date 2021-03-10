export enum ActivityValueType {
  OBJECT = 'object',
  FIELD = 'field',
  TIMING = 'timing',
};

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
