export default class FormInstanceTECoreProps {
  assignedTo;
  acceptanceStatus;
  acceptanceComment;
  schedulingProgress;
  selectionSettings;
  starred;

  constructor({
    assignedTo = [],
    acceptanceStatus = null,
    acceptanceComment = null,
    schedulingProgress = null,
    selectionSettings = {},
    starred = [],
  }) {
    this.assignedTo = assignedTo;
    this.acceptanceStatus = acceptanceStatus;
    this.acceptanceComment = acceptanceComment;
    this.schedulingProgress = schedulingProgress;
    this.selectionSettings = selectionSettings;
    this.starred = starred;
  }
}
