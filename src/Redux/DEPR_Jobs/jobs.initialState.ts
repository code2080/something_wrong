import { Job } from '../../Models/Job.model';

export type JobState = { [formId: string]: { [jobId: string]: Job } };

const initState: JobState = {};

export default initState;
