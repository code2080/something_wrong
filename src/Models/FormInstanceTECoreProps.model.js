import {
  teCoreAcceptanceStatus,
  teCoreSchedulingProgress,
} from '../Constants/teCoreProps.constants';
export default class FormInstanceTECoreProps {
  assignedTo;
  acceptanceStatus;
  acceptanceComment;
  schedulingProgress;
  selectionSettings;
  isStarred;

  constructor({
    assignedTo = [],
    acceptanceStatus = teCoreAcceptanceStatus.NOT_SET,
    acceptanceComment = '',
    schedulingProgress = teCoreSchedulingProgress.NOT_SCHEDULED,
    selectionSettings = {},
    isStarred = false,
  }) {
    this.assignedTo = assignedTo;
    this.acceptanceStatus = acceptanceStatus;
    this.acceptanceComment = acceptanceComment;
    this.schedulingProgress = schedulingProgress;
    this.selectionSettings = selectionSettings;
    this.isStarred = isStarred;
  }
}
