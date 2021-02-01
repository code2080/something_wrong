import React, { useEffect } from 'react';
import { Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import _ from 'lodash';

// ACTIONS
import { abortJob, fetchAllJobs } from '../../Redux/Jobs/jobs.actions';
import { fetchActivitiesForFormInstance } from '../../Redux/Activities/activities.actions';

// COMPONENTS
import { Progress, Tooltip } from 'antd';

// SELECTORS
import { selectActiveJobsForFormInstance } from '../../Redux/Jobs/jobs.selectors';

// STYLES
import './JobToolbar.scss';

const JobToolbar = () => {
  const dispatch = useDispatch();
  const pollInterval = 1000;

  const { formId, formInstanceId } = useParams();
  const activeJobs = useSelector(selectActiveJobsForFormInstance(formId, formInstanceId));
  const currentJob = _.head(activeJobs);
  const { score: { current, initial } } = currentJob || { score: { current: null, initial: null } };
  const currHard = current && current.hard;
  const initHard = initial && initial.hard;
  const currSoft = current && current.soft;
  const initSoft = initial && initial.soft;
  const percentageDone = _.get(currentJob, "status") === 'STARTED'
    ? Math.round(Math.abs((initHard - currHard + initSoft - currSoft) / (initHard + initSoft)) * 100)
    : 0;
  const statusText = _.get(currentJob, "status") === 'STARTED'
    ? `${Math.abs(currHard)} hard/${Math.abs(currSoft)} soft left of initially ${Math.abs(initHard)} hard/${Math.abs(initSoft)} soft`
    : `Job not started yet`;
  const pollJobs = () => {
    dispatch(fetchAllJobs());
    dispatch(fetchActivitiesForFormInstance(formId, formInstanceId));
    setTimeout(pollJobs, pollInterval)
  }

  useEffect(() => {
    pollJobs();
  }, []);


  const stopJob = () => {
    if (currentJob) {
      dispatch(abortJob({
        jobId: currentJob._id,
        formId,
        formInstanceId,
        activities: currentJob.activities,
      }));
    }
  }

  return (
    <div className="job-toolbar--wrapper">
      {currentJob && (
        <div className="active-job--wrapper">
          <span className="label">Scheduling job in progress</span>
          <Button
            type="link"
            size="small"
            onClick={stopJob}
          >
            Stop
          </Button>
          <Tooltip
            title={statusText}
            getPopupContainer={() => document.getElementById('te-prefs-lib')}
          >
            <Progress
              percent={percentageDone}
              status='active'
            />
          </Tooltip>
          {
            // <div className="meter">
            //   <span />
            // </div>
          }
        </div>
      )}
    </div>
  );
};

export default JobToolbar;
