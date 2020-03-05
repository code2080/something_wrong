export const activityValueModes = {
  FROM_SUBMISSION: 'FROM_SUBMISSION',
  MANUAL: 'MANUAL',
};

export const activityValueModeProps = {
  [activityValueModes.FROM_SUBMISSION]: {
    label: 'From submission',
    icon: 'form',
  },
  [activityValueModes.MANUAL]: {
    label: 'Manual',
    icon: 'user',
  },
};
