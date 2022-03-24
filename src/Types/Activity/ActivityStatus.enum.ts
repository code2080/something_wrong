export enum EActivityStatus {
  NOT_SCHEDULED = 'NOT_SCHEDULED', // No scheduling attempt has been made
  SCHEDULED = 'SCHEDULED', // Activity is scheduled
  MODIFIED = 'MODIFIED', // Activity is scheduled, but has been modified in external system
  DELETED = 'DELETED', // Activity is scheduled, but has been deleted in external system
  NO_AVAILABILITY = 'NO_AVAILABILITY', // When the combination of objects are impossible to schedule in the given time range
  VALIDATION_ERROR = 'VALIDATION_ERROR', // One of the activity values has a validation error
  FAILED = 'FAILED', // When a scheduling attempt has been made but failed
  QUEUED = 'QUEUED', // Activity is waiting to be scheduled
  INACTIVE = 'INACTIVE', // Activity has been inactivated by a merge
  GROUPED_MULTIPLE = 'GROUPED_MULTIPLE', // For grouped activities (like week pattern) with multiple statuses
}

export const CActivityStatus = {
  [EActivityStatus.NOT_SCHEDULED]: {
    color: 'default',
    label: 'Not scheduled',
    icon: 'minus',
    tooltip: () => 'The activity has not been scheduled yet',
  },
  [EActivityStatus.SCHEDULED]: {
    color: 'success',
    label: 'Scheduled',
    icon: 'check',
    tooltip: (reservationId) =>
      `Activity has been scheduled with reservation id ${reservationId}`,
  },
  [EActivityStatus.MODIFIED]: {
    color: 'warning',
    label: 'Modified',
    icon: 'exclamation',
    tooltip: (reservationId) =>
      `The activity has been scheduled with id ${reservationId}, but has been modified since`,
  },
  [EActivityStatus.DELETED]: {
    color: 'attention',
    label: 'Deleted',
    icon: 'warning',
    tooltip: (reservationId) =>
      `The activity was scheduled with id ${reservationId}, but has been deleted since`,
  },
  [EActivityStatus.NO_AVAILABILITY]: {
    color: 'attention',
    label: 'No availability',
    icon: 'warning',
    tooltip: () =>
      "There's no availability to schedule this combination of objects within the given time constraints",
  },
  [EActivityStatus.VALIDATION_ERROR]: {
    color: 'attention',
    label: 'Validation error',
    icon: 'warning',
    tooltip: () => 'One or many acitivty values have validations errors',
  },
  [EActivityStatus.FAILED]: {
    color: 'attention',
    label: 'Failed',
    icon: 'warning',
    tooltip: () =>
      'An attempt to schedule this activity was made, but it failed',
  },
  [EActivityStatus.QUEUED]: {
    color: 'default',
    label: 'Queued',
    icon: 'warning',
    tooltip: () => 'The activity is waiting to be scheduled',
  },
  [EActivityStatus.GROUPED_MULTIPLE]: {
    color: 'warning',
    label: 'Multiple statuses',
    icon: 'warning',
    tooltip: () => 'This group contains activities with multiple statuses',
  },
};
