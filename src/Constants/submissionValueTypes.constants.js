export const submissionValueTypes = {
  OBJECT: 'OBJECT',
  FREE_TEXT: 'FREE_TEXT',
  TIMING: 'TIMING',
  FILTER: 'FILTER',
};

export const submissionValueTypeProps = {
  [submissionValueTypes.OBJECT]: {
    label: 'Object',
    icon: 'build',
  },
  [submissionValueTypes.FREE_TEXT]: {
    label: 'Free text',
    icon: 'edit',
  },
  [submissionValueTypes.TIMING]: {
    label: 'Timing',
    icon: 'clock-circle',
  },
  [submissionValueTypes.FILTER]: {
    label: 'Object filter',
    icon: 'filter',
  },
};
