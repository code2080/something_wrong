export const teCoreAcceptanceStatus = {
  NOT_SET: 'NOT_SET',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
};

export const teCoreAcceptanceStatusProps = {
  [teCoreAcceptanceStatus.NOT_SET]: {
    key: teCoreAcceptanceStatus.NOT_SET,
    label: 'Not set',
    color: 'default',
  },
  [teCoreAcceptanceStatus.ACCEPTED]: {
    key: teCoreAcceptanceStatus.ACCEPTED,
    label: 'Accepted',
    color: 'success',
  },
  [teCoreAcceptanceStatus.REJECTED]: {
    key: teCoreAcceptanceStatus.REJECTED,
    label: 'Rejected',
    color: 'attention',
  },
};

export const teCoreSchedulingProgress = {
  NOT_SCHEDULED: 'NOT_SCHEDULED',
  IN_PROGRESS: 'IN_PROGRESS',
  SCHEDULING_FINISHED: 'SCHEDULING_FINISHED',
};

export const teCoreSchedulingProgressProps = {
  [teCoreSchedulingProgress.NOT_SCHEDULED]: {
    key: teCoreSchedulingProgress.NOT_SCHEDULED,
    label: 'Not scheduled',
    color: 'default',
  },
  [teCoreSchedulingProgress.IN_PROGRESS]: {
    key: teCoreSchedulingProgress.IN_PROGRESS,
    label: 'In progress',
    color: 'warning',
  },
  [teCoreSchedulingProgress.SCHEDULING_FINISHED]: {
    key: teCoreSchedulingProgress.SCHEDULING_FINISHED,
    label: 'Finished',
    color: 'success',
  },
};

export const toAcceptanceLabel = status => {
  if (status === teCoreAcceptanceStatus.ACCEPTED) {
    return 'Accepted';
  }
  if (status === teCoreAcceptanceStatus.REJECTED) {
    return 'Rejected';
  }
  return 'Not set';
}

export const toProgressLabel = progress => {
  if (progress === teCoreSchedulingProgress.NOT_SCHEDULED) {
    return 'Not scheduled';
  }
  if (progress === teCoreSchedulingProgress.IN_PROGRESS) {
    return 'In progress';
  }
  if (progress === teCoreSchedulingProgress.SCHEDULING_FINISHED) {
    return 'Finished';
  }
  return 'Not set';
}
