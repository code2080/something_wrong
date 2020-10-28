import { createSelector } from 'reselect';
import { jobStatus } from '../../Constants/jobStatuses.constants';

const jobStateSelector = state => state.jobs;

export const selectJobsForForm = createSelector(
  jobStateSelector,
  jobs => formId => jobs[formId]
);

export const selectJobForActivities = createSelector(
  jobStateSelector,
  jobs => (formId, activityIds = []) => {
    const j = (jobs[formId] || {});
    const jobIds = (Object.keys(j) || []).filter(
      jobId => {
        if (!j[jobId].activities || !j[jobId].activities.length)
          return false;
        const { activities } = j[jobId];
        return activities.some(a => activityIds.indexOf(a._id) > -1);
      }
    );
    return (jobIds || []).map(jobId => j[jobId]);
  }
);

export const selectActiveJobsForFormInstance = createSelector(
  jobStateSelector,
  jobs => (formId, formInstanceId) => {
    const j = (jobs[formId] || {});
    const jobIds = (Object.keys(j) || []).filter(
      jobId => j[jobId] &&
        j[jobId].formInstanceIds &&
        j[jobId].formInstanceIds.indexOf(formInstanceId) > -1 &&
        (j[jobId].status === jobStatus.NOT_STARTED || j[jobId].status === jobStatus.STARTED)
    );
    return (jobIds || []).map(jobId => j[jobId]);
  }
);
