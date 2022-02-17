import { createSelector } from 'reselect';
import { jobStatus } from '../../Constants/jobStatuses.constants';
import { JobState } from './jobs.initialState';

// todo: fully type the entire state and just import it
const jobStateSelector = (state: { jobs: JobState }): JobState => state.jobs;

export const selectJobsForForm = (formId: string) =>
  createSelector(jobStateSelector, (jobs) => jobs[formId] || []);

export const selectJobFromForm = createSelector(
  jobStateSelector,
  (jobs) => (jobId, formId) => {
    if (!jobId || !formId) return null;
    if (!jobs[formId]) return null;
    const job = jobs[formId][jobId];
    if (!job) return null;
    return job;
  },
);

export const selectJobForActivities = (formId: string, activityIds: string[]) =>
  createSelector(selectJobsForForm(formId), (formJobs) => {
    const jobIds = Object.keys(formJobs).filter((jobId) => {
      if (!formJobs[jobId].activities || !formJobs[jobId].activities.length) {
        return false;
      }
      const { activities } = formJobs[jobId];
      return activities.some((a) => activityIds.includes(a._id));
    });

    return (jobIds || []).map((jobId) => formJobs[jobId]);
  });

export const selectActiveJobsForFormInstance = (formId, formInstanceId) =>
  createSelector(selectJobsForForm(formId), (formJobs) => {
    const activeJobs = Object.values(formJobs || {}).filter(
      (job) =>
        job.formInstanceIds &&
        job.formInstanceIds.includes(formInstanceId) &&
        (job.status === jobStatus.NOT_STARTED ||
          job.status === jobStatus.STARTED),
    );
    return activeJobs;
  });
