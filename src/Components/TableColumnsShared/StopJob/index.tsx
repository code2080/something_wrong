import { StopOutlined } from "@ant-design/icons"

// HOOKS
import { useScheduling } from "Hooks/useScheduling";

// STYLES
import './index.scss';

// TYPES
import { EJobStatus, TJob } from "Types/Job.type";
import { Tooltip } from "antd";

type Props = {
  job: TJob;
};

const StopJob = ({ job }: Props) => {
  const { stopJob } = useScheduling();

  const onClick = () => {
    stopJob(job._id);
  };

  const isDisabled = ![EJobStatus.NOT_STARTED, EJobStatus.STARTED].includes(job.status);
  return (
    <Tooltip
      title={isDisabled ? 'This job has finished and can\'t be stopped' : 'Click to stop the job'}
      getPopupContainer={() => document.getElementById('te-prefs-lib') as HTMLElement}
    >
      <div 
        className={`stop-job-btn--wrapper ${ isDisabled ? 'disabled' : ''}`}
        onClick={onClick}
      >
        <StopOutlined />
      </div>
    </Tooltip>
  );
};

export default StopJob;