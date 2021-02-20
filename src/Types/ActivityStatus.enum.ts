export enum EActivityStatus {
  NOT_SCHEDULED = 'NOT_SCHEDULED', // No scheduling attempt has been made
  SCHEDULED = 'SCHEDULED', // Activity is scheduled
  MODIFIED = 'MODIFIED', // Activity is scheduled, but has been modified in external system
  DELETED = 'DELETED', // Activity is scheduled, but has been deleted in external system
  NO_AVAILABILITY = 'NO_AVAILABILITY', // When the combination of objects are impossible to schedule in the given time range
  VALIDATION_ERROR = 'VALIDATION_ERROR', // One of the activity values has a validation error
  FAILED = 'FAILED', // When a scheduling attempt has been made but failed
  QUEUED = 'QUEUED', // Activity is waiting to be scheduled
};
