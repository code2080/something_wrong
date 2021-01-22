import { Button } from 'antd';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { abortJob } from '../../Redux/Jobs/jobs.actions';

import { selectActiveJobsForFormInstance } from '../../Redux/Jobs/jobs.selectors';

// STYLES
import './JobToolbar.scss';

const JobToolbar = () => {
  const dispatch = useDispatch();

  const { formId, formInstanceId } = useParams();
  const activeJobs = useSelector(selectActiveJobsForFormInstance(formId, formInstanceId));

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
