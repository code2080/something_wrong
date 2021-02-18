export const activityTimeModes = {
  EXACT: 'EXACT',
  TIMESLOTS: 'TIMESLOTS',
  SEQUENCE: 'SEQUENCE',
};

export const activityTimeModeProps = {
  [activityTimeModes.EXACT]: {
    label: 'Exact',
    mandatoryProperties: ['startTime', 'endTime'],
  },
  [activityTimeModes.TIMESLOTS]: {
    label: 'Timeslots',
    mandatoryProperties: ['startTime', 'endTime', 'length'],
  },
  [activityTimeModes.SEQUENCE]: {
    label: 'Sequence',
    mandatoryProperties: ['length'],
  },
};
