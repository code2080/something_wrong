// COMPONENTS
import StatusLabel from '../../StatusLabel';

// STYLES
import './index.scss';

// TYPES
import { CJobStatus, EJobStatus } from 'Types/Job.type';

type Props = { jobStatus: EJobStatus };

const JobStatus = ({ jobStatus }: Props) => {
  return (
    <div className='activity-status-column'>
      <StatusLabel color={CJobStatus[jobStatus]?.color ?? 'default'}>
        {CJobStatus[jobStatus]?.label ?? jobStatus}
      </StatusLabel>
    </div>
  );
};

export default JobStatus;
