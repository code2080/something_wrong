export const mappingStatuses = {
  NOT_SET: 'NOT_SET',
  PARTIAL: 'PARTIAL',
  ALL_MANDATORY: 'ALL_MANDATORY',
  COMPLETE: 'COMPLETE',
};

export const mappingStatusProps = {
  [mappingStatuses.NOT_SET]: {
    label: 'Not set',
    tooltip: reservationTemplateName => `No mapping for ${reservationTemplateName} has been created`,
  },
  [mappingStatuses.PARTIAL]: {
    label: 'Partial',
    tooltip: reservationTemplateName => `Mapping for ${reservationTemplateName} is not complete`,
  },
  [mappingStatuses.ALL_MANDATORY]: {
    label: 'Mandatory properties mapped',
    tooltip: reservationTemplateName => `All mandatory properties for ${reservationTemplateName} are mapped`,
  },
  [mappingStatuses.COMPLETE]: {
    label: 'All properties mapped',
    tooltip: reservationTemplateName => `All properties for ${reservationTemplateName} are mapped`,
  },
};
