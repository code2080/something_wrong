export const reservationStatuses = {
  NOT_SCHEDULED: 'NOT_SCHEDULED', // No scheduling attempt has been made
  SCHEDULED: 'SCHEDULED', // Reservation is scheduled
  MODIFIED: 'MODIFIED', // Reservation is scheduled, but has been modified in external system
  DELETED: 'DELETED', // Reservation is scheduled, but has been deleted in external system
  NO_AVAILABILITY: 'NO_AVAILABILITY', // When the combination of objects are impossible to schedule in the given time range
  FAILED: 'FAILED', // When a scheduling attempt has been made but failed
};

export const reservationStatusProps = {
  [reservationStatuses.NOT_SCHEDULED]: {
    color: 'swedishSkies',
    label: 'Not scheduled',
    icon: 'minus',
    tooltip: () => 'The reservation has not been scheduled yet',
  },
  [reservationStatuses.SCHEDULED]: {
    color: 'jungleGreen',
    label: 'Scheduled',
    icon: 'check',
    tooltip: reservationId => `Reservation has been scheduled with reservation id ${reservationId}`,
  },
  [reservationStatuses.MODIFIED]: {
    color: 'candlelight',
    label: 'Modified',
    icon: 'exclamation',
    tooltip: reservationId => `The reservation has been scheduled with id ${reservationId}, but has been modified since`,
  },
  [reservationStatuses.DELETED]: {
    color: 'bittersweet',
    label: 'Deleted',
    icon: 'warning',
    tooltip: reservationId => `The reservation was scheduled with id ${reservationId}, but has been deleted since`,
  },
  [reservationStatuses.NO_AVAILABILITY]: {
    color: 'bittersweet',
    label: 'No availability',
    icon: 'warning',
    tooltip: () => `There's no availability to schedule this combination of objects within the given time constraints`,
  },
  [reservationStatuses.FAILED]: {
    color: 'bittersweet',
    label: 'Failed',
    icon: 'warning',
    tooltip: () => `An attempt to schedule this reservation was made, but it failed`,
  }
};

export const reservationValueStatuses = {
  MISSING_DATA: 'MISSING_DATA', // Can not be scheduled yet due to missing data
  READY_FOR_SCHEDULING: 'READY_FOR_SCHEDULING', // The value has all the components it needs to be scheduled,
};

export const reservationValueStatusProps = {
  [reservationValueStatuses.MISSING_DATA]: {
    label: 'Missing data',
    tooltip: "The submission doesn't contain enough data to automatically schedule this value, please update it manually",
  },
  [reservationValueStatuses.READY_FOR_SCHEDULING]: {
    label: 'Ready for scheduling',
    tooltip: 'This value is ready for scheduling',
  },
};
