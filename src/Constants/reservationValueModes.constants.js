export const reservationValueModes = {
  FROM_SUBMISSION: 'FROM_SUBMISSION',
  MANUAL: 'MANUAL',
};

export const reservationValueModeProps = {
  [reservationValueModes.FROM_SUBMISSION]: {
    label: 'From submission',
    icon: 'form',
  },
  [reservationValueModes.MANUAL]: {
    label: 'Manual',
    icon: 'user',
  },
};
