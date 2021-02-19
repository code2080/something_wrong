export default class FormInstanceTECoreProps {
  assignedTo;
  acceptanceStatus;
  acceptanceComment;
  schedulingProgress;
  selectionSettings;
  isStarred;

  constructor ({
    assignedTo = [],
    acceptanceStatus = null,
    acceptanceComment = null,
    schedulingProgress = null,
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
