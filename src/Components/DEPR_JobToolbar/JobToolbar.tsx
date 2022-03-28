import { Button } from 'antd';
import { useSelector } from 'react-redux';

// SELECTORS
import { selectJobFromForm } from '../../Redux/DEPR_Jobs/jobs.selectors';

// HOOKS
import { useJobWSAPI } from '../../Hooks/DEPR_useJobWSAPI';

// STYLES
import './JobToolbar.scss';

const JobToolbar = () => {
  const { activeJobId, activeJobFormId, stopJob } = useJobWSAPI();
  const job = useSelector(selectJobFromForm)(activeJobId, activeJobFormId);

  const onStopJob = () => {
    stopJob();
  };

  /** We know that a job exists */
  const hasActiveJob = job && job._id;
  /** A job is active and currently trying to schedule */
  const isStopable = hasActiveJob && job.status === 'STARTED';

  const getStatusForJobLabel = () => {
    if (isStopable) return 'Scheduling job in progress';
    if (hasActiveJob) return 'Preparing job';

    return 'No active automatic scheduling job';
  };

  return (
    <div className='job-toolbar--wrapper'>
      <div className='active-job--wrapper'>
        <span className={`label ${hasActiveJob ? 'isActive' : 'inactive'}`}>
          {getStatusForJobLabel()}
        </span>
        <>
          {isStopable && (
            <Button type='link' size='small' onClick={onStopJob}>
              Stop
            </Button>
          )}
          {hasActiveJob && (
            <div className='meter'>
              <span />
            </div>
          )}
        </>
      </div>
    </div>
  );
};

export default JobToolbar;
