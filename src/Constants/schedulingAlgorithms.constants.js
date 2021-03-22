export const schedulingAlgorithms = {
  EXACT: 'EXACT',
  BEST_FIT_OBJECT: 'BEST_FIT_OBJECT',
  BEST_FIT_TIME: 'BEST_FIT_TIME',
  BEST_FIT_OBJECT_TIME: 'BEST_FIT_OBJECT_TIME',
  UNKNOWN: 'UNKNOW',
};

export const schedulingAlgorithmProps = {
  [schedulingAlgorithms.EXACT]: {
    label: 'Exact',
    icon: 'check-square',
    tooltip: 'The scheduling will contain exactly this value',
  },
  [schedulingAlgorithms.BEST_FIT_OBJECT]: {
    label: 'Best fit',
    icon: 'dashboard',
    tooltip:
      'An available object based on the filters will be selected during scheduling',
  },
  [schedulingAlgorithms.BEST_FIT_TIME]: {
    label: 'Best fit',
    icon: 'dashboard',
    tooltip:
      'A time within this range when all objects are available will be selected during scheduling',
  },
  [schedulingAlgorithms.UNKNOWN]: {
    label: 'Unknown',
    icon: 'dashboard',
    tooltip: 'This scheduling algortihm is unknown',
  },
};
