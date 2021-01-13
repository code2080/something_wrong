import { jobStatus } from '../Constants/jobStatuses.constants';
import { schedulingAlgorithms } from '../Constants/schedulingAlgorithms.constants';

export class Job {
  id;
  activities;
  type;
  organizationId;
  userId;
  formId;
  formPeriod;
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
    userId = -1,
    formId,
    formPeriod,
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
    this.userId = userId;
    this.formId = formId;
    this.formPeriod = formPeriod;
    this.formInstanceIds = formInstanceIds;
    this.customerSignature = customerSignature;
    this.username = username;
    this.password = password;
    this.status = status;
  }
}
