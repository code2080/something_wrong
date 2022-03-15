import { EActivityStatus } from '../Types/Activity/ActivityStatus.enum';

export const activityStatusProps = {
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
};

export const activityValueStatuses = {
  MISSING_DATA: 'MISSING_DATA', // Can not be scheduled yet due to missing data
  READY_FOR_SCHEDULING: 'READY_FOR_SCHEDULING', // The value has all the components it needs to be scheduled,
};

export const activityValueStatusProps = {
  [activityValueStatuses.MISSING_DATA]: {
    label: 'Missing data',
    tooltip:
      "The submission doesn't contain enough data to automatically schedule this value, please update it manually",
  },
  [activityValueStatuses.READY_FOR_SCHEDULING]: {
    label: 'Ready for scheduling',
    tooltip: 'This value is ready for scheduling',
  },
};
