export default class FormInstanceTECoreProps {
  assignedTo;
  acceptanceStatus;
  acceptanceComment;
  schedulingProgress;

  constructor({
    assignedTo = [],
    acceptanceStatus,
    acceptanceComment,
    schedulingProgress,
  }) {
    this.assignedTo = assignedTo;
    this.acceptanceStatus = acceptanceStatus;
    this.acceptanceComment = acceptanceComment;
    this.schedulingProgress = schedulingProgress;
  }
}
