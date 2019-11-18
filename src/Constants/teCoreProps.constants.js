export const teCoreAcceptanceStatus = {
  NOT_SET: 'NOT_SET',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
};

export const teCoreSchedulingProgress = {
  NOT_SCHEDULED: 'NOT_SCHEDULED',
  IN_PROGRESS: 'IN_PROGRESS',
  SCHEDULING_FINISHED: 'SCHEDULING_FINISHED',
};

export const toAcceptanceLabel = status => {
  if (status === teCoreAcceptanceStatus.ACCEPTED) {
    return "Accepted";
  }
  if (status === teCoreAcceptanceStatus.REJECTED) {
    return "Rejected";
  }
  return "Not set";
}

export const toProgressLabel = progress => {
  if (progress === teCoreSchedulingProgress.NOT_SCHEDULED) {
    return "Not scheduled";
  }
  if (progress === teCoreSchedulingProgress.IN_PROGRESS) {
    return "In progress";
  }
  if (progress === teCoreSchedulingProgress.SCHEDULING_FINISHED) {
    return "Finished";
  }
  return "Not set";
}
