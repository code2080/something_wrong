import { jobStatus } from '../Constants/jobStatuses.constants';

export class JobStatus {
  id;
  score;
  status;

  constructor({
    _id = null,
    score = {},
    status = jobStatus.NOT_STARTED,
  }) {
    this.id = _id;
    this.score = score;
    this.status = status;
  }
}
