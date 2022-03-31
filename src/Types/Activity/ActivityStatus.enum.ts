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
  SCHEDULING_IN_PROGRESS = 'SCHEDULING_IN_PROGRESS',
  GROUPED_MULTIPLE = 'GROUPED_MULTIPLE', // For grouped activities (like week pattern) with multiple statuses
}

export const CActivityStatus = {
  [EActivityStatus.NOT_SCHEDULED]: {
    color: 'default',
    label: 'Not scheduled',
  },
  [EActivityStatus.SCHEDULED]: {
    color: 'success',
    label: 'Scheduled',
  },
  [EActivityStatus.MODIFIED]: {
    color: 'warning',
    label: 'Modified',
  },
  [EActivityStatus.DELETED]: {
    color: 'attention',
    label: 'Deleted',
  },
  [EActivityStatus.NO_AVAILABILITY]: {
    color: 'attention',
    label: 'No availability',
  },
  [EActivityStatus.VALIDATION_ERROR]: {
    color: 'attention',
    label: 'Validation error',
  },
  [EActivityStatus.FAILED]: {
    color: 'attention',
    label: 'Failed',
  },
  [EActivityStatus.QUEUED]: {
    color: 'warning',
    label: 'Queued',
  },
  [EActivityStatus.SCHEDULING_IN_PROGRESS]: {
    color: 'info',
    label: 'In progress',
  },
  [EActivityStatus.GROUPED_MULTIPLE]: {
    color: 'warning',
    label: 'Multiple statuses',
  },
};
