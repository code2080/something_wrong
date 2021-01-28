import React, { useEffect } from 'react';
import { Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

// ACTIONS
import { abortJob, fetchAllJobs } from '../../Redux/Jobs/jobs.actions';

// SELECTORS
import { selectActiveJobsForFormInstance } from '../../Redux/Jobs/jobs.selectors';

// STYLES
import './JobToolbar.scss';
import { fetchActivitiesForFormInstance } from '../../Redux/Activities/activities.actions';

const JobToolbar = () => {
  const dispatch = useDispatch();
  const pollInterval = 10000;

  const { formId, formInstanceId } = useParams();
  const activeJobs = useSelector(selectActiveJobsForFormInstance(formId, formInstanceId));

  const pollJobs = () => {
    dispatch(fetchAllJobs());
    dispatch(fetchActivitiesForFormInstance(formId, formInstanceId));
    setTimeout(pollJobs, pollInterval)
  }

  useEffect(() => {
    pollJobs();
  }, []);


  const stopJob = () => {
    if (activeJobs && activeJobs.length && activeJobs[0]) {
      const job = activeJobs[0];
      dispatch(abortJob({
        jobId: job._id,
        formId,
        formInstanceId,
        activities: job.activities,
      }));
    }
  }

  return (
    <div className="job-toolbar--wrapper">
      {activeJobs && activeJobs.length > 0 && (
        <div className="active-job--wrapper">
          <span className="label">Scheduling job in progress</span>
          <Button
            type="link"
            size="small"
            onClick={stopJob}
          >
            Stop
          </Button>
          <div className="meter">
            <span />
          </div>
        </div>
      )}
    </div>
  );
};

export default JobToolbar;
