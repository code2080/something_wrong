import { jobStatus } from '../Constants/jobStatuses.constants';
import { schedulingAlgorithms } from '../Constants/schedulingAlgorithms.constants';

export class Job {
  id;
  activities;
  type;
  organizationId;
  formId;
  formInstanceIds;
  customerSignature;
  username;
  password;
  status;

  constructor({
    id,
    activities = [],
    type = schedulingAlgorithms.UNKNOWN,
    organizationId,
    formId,
    formInstanceIds = [],
    customerSignature,
    username,
    password,
    status = jobStatus.NOT_STARTED,
  }) {
    this.id = id;
    this.activities = activities;
    this.type = type;
    this.organizationId = organizationId;
    this.formId = formId;
    this.formInstanceIds = formInstanceIds;
    this.customerSignature = customerSignature;
    this.username = username;
    this.password = password;
    this.status = status;
  }
}
