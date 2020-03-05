export const mappingStatuses = {
  NOT_SET: 'NOT_SET',
  COMPLETE: 'COMPLETE',
};

export const mappingStatusProps = {
  [mappingStatuses.NOT_SET]: {
    label: 'Not set',
    tooltip: reservationTemplateName => `No mapping for ${reservationTemplateName} has been created`,
  },
  [mappingStatuses.COMPLETE]: {
    label: 'All properties mapped',
    tooltip: reservationTemplateName => `All properties for ${reservationTemplateName} are mapped`,
  },
};
