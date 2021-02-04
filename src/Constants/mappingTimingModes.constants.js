export const mappingTimingModes = {
  EXACT: 'EXACT',
  TIMESLOTS: 'TIMESLOTS',
  SEQUENCE: 'SEQUENCE',
};

export const mappingTimingModeProps = {
  [mappingTimingModes.EXACT]: {
    label: 'Exact',
    mandatoryProperties: ['startTime', 'endTime'],
  },
  [mappingTimingModes.TIMESLOTS]: {
    label: 'Timeslots',
    mandatoryProperties: ['startTime', 'endTime', 'length'],
  },
  [mappingTimingModes.SEQUENCE]: {
    label: 'Sequence',
    mandatoryProperties: ['length'],
  },
};
