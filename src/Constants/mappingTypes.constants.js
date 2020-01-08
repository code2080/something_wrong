export const mappingTypes = {
  FIELD: 'FIELD',
  OBJECT: 'OBJECT',
  TIMING: 'TIMING',
  UNDEFINED: 'UNDEFINED',
};

export const mappingTypeProps = {
  [mappingTypes.FIELD]: {
    label: 'Field',
    icon: 'tag',
    tooltip: 'Mapped to a reservation field',
  },
  [mappingTypes.OBJECT]: {
    label: 'Object',
    icon: 'build',
    tooltip: 'Mapped to a reservation object',
  },
  [mappingTypes.TIMING]: {
    label: 'Timing',
    icon: 'clock-circle',
    tooltip: "Mapped to the reservation's start and end time",
  },
  [mappingTypes.UNDEFINED]: {
    label: 'Undefined',
    icon: 'clock-circle',
    tooltip: 'Mapped to an undefined reservation property',
  },
};
