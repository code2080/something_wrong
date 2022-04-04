import { StopTwoTone } from '@ant-design/icons';

// COMPONENTS
import StatusLabel from '../../StatusLabel';

// HOOKS
import { useScheduling } from 'Hooks/useScheduling';

// STYLES
import './index.scss';

// TYPES
import { CJobStatus, EJobStatus, TJob } from 'Types/Job.type';
import { Tooltip } from 'antd';

type Props = {
  job: TJob
};

const JobStatus = ({ job }: Props) => {
  const { stopJob } = useScheduling();

  const canBeStopped = [EJobStatus.NOT_STARTED, EJobStatus.STARTED].includes(
    job.status,
  );

  /**
   * EVENT HANDLERS
   */
  const onClick = () => {
    if (canBeStopped) stopJob(job._id);
  };

  return (
    <StatusLabel color={CJobStatus[job.status]?.color ?? 'default'} onClick={onClick} style={{ cursor: 'pointer' }}>
      {CJobStatus[job.status]?.label ?? job.status}
      {canBeStopped && (
        <Tooltip title="Click to stop this job">
          <div className="job-status--btn">
            <StopTwoTone twoToneColor="#ff6357"/>
          </div>
        </Tooltip>
      )}
    </StatusLabel>
  );
};

export default JobStatus;
