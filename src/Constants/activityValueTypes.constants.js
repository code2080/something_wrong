export const activityValueTypes = {
  OBJECT: 'object',
  FIELD: 'field',
  TIMING: 'timing',
};

export const activityValueTypeProps = {
  [activityValueTypes.OBJECT]: {
    path: 'objects',
  },
  [activityValueTypes.FIELD]: {
    path: 'fields',
  },
  [activityValueTypes.TIMING]: {
    path: 'timing',
  },
};
