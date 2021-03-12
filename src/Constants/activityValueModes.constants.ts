export enum ActivityValueMode {
  FROM_SUBMISSION = 'FROM_SUBMISSION',
  MANUAL = 'MANUAL',
};

export const activityValueModeProps = {
  [ActivityValueMode.FROM_SUBMISSION]: {
    label: 'From submission',
    icon: 'form',
  },
  [ActivityValueMode.MANUAL]: {
    label: 'Manual',
    icon: 'user',
  },
};
