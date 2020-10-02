export default class FormInstanceTECoreProps {
  assignedTo;
  acceptanceStatus;
  acceptanceComment;
  schedulingProgress;
  selectionSettings;

  constructor({
    assignedTo = [],
    acceptanceStatus = null,
    acceptanceComment = null,
    schedulingProgress = null,
    selectionSettings = {},
  }) {
    this.assignedTo = assignedTo;
    this.acceptanceStatus = acceptanceStatus;
    this.acceptanceComment = acceptanceComment;
    this.schedulingProgress = schedulingProgress;
    this.selectionSettings = selectionSettings;
  }
}
