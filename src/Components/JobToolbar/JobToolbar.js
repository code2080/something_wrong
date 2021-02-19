import React from 'react';
import { Button } from 'antd';
import { useSelector } from 'react-redux';
import _ from 'lodash';

// ACTIONS
import React from 'react';
import { Button } from 'antd';
import { useSelector } from 'react-redux';

// SELECTORS
import { selectJobFromForm } from '../../Redux/Jobs/jobs.selectors';

// HOOKS
import { useJobWSAPI } from '../../Hooks/useJobAPI';

// STYLES
import './JobToolbar.scss';

const JobToolbar = () => {
  const { activeJobId, activeJobFormId, stopJob } = useJobWSAPI();
  const job = useSelector(selectJobFromForm)(activeJobId, activeJobFormId);

  const onStopJob = () => {
    if (activeJobId) { stopJob(); }
  };

  const hasActiveJob = job && job._id;
  return (
    <div className='job-toolbar--wrapper'>
      <div className='active-job--wrapper'>
        <span className={`label ${hasActiveJob ? 'active' : 'inactive'}`}>
          {hasActiveJob
            ? 'Scheduling job in progress'
            : 'No active automatic scheduling job'
          }
        </span>
        {hasActiveJob && (
          <React.Fragment>
            <Button
              type='link'
              size='small'
              onClick={onStopJob}
            >
              Stop
            </Button>
            <div className='meter'>
              <span />
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default JobToolbar;
