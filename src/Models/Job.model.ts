import { TActivity } from 'Types/Activity/Activity.type';
import { jobStatus } from '../Constants/jobStatuses.constants';
import { schedulingAlgorithms } from '../Constants/schedulingAlgorithms.constants';

export class Job {
  _id;
  activities: TActivity[];
  type;
  organizationId;
  userId;
  formId;
  formPeriod;
  formInstanceIds;
  customerSignature;
  username;
  password;
  token;
  constraintConfigurationId;
  status;
  reservationMode;
  score;

  constructor({
    _id,
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
    token,
    constraintConfigurationId,
    status = jobStatus.NOT_STARTED,
    score = { initial: null, current: null },
    reservationMode,
  }) {
    this._id = _id;
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
    this.token = token;
    this.constraintConfigurationId = constraintConfigurationId;
    this.status = status;
    this.score = score;
    this.reservationMode = reservationMode;
  }
}
