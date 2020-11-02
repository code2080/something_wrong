import { createSelector } from 'reselect';
import { jobStatus } from '../../Constants/jobStatuses.constants';

const jobStateSelector = state => state.jobs;

export const selectJobsForForm = formId => createSelector(
  jobStateSelector,
  jobs => jobs[formId]
);

export const selectJobForActivities = (formId, activityIds = [])=> createSelector(
  selectJobsForForm(formId),
  formJobs => {
    const jobIds = (Object.keys(formJobs) || [])
    .filter(jobId => {
        if (!formJobs[jobId].activities || !formJobs[jobId].activities.length)
          return false;
        const { activities } = formJobs[jobId];
        return activities.some(a => activityIds.includes(a._id));
      }
    );
    return (jobIds || []).map(jobId => formJobs[jobId]);
  }
);

export const selectActiveJobsForFormInstance = (formId, formInstanceId) => createSelector(
  selectJobsForForm(formId),
  formJobs => {
    const jobIds = (Object.keys(formJobs) || []).filter(
      jobId => formJobs[jobId] &&
        formJobs[jobId].formInstanceIds &&
        formJobs[jobId].formInstanceIds.includes(formInstanceId) &&
        (formJobs[jobId].status === jobStatus.NOT_STARTED || formJobs[jobId].status === jobStatus.STARTED)
    );
    return (jobIds || []).map(jobId => formJobs[jobId]);
  }
);
