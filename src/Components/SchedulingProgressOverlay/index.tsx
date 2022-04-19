/* eslint-disable react/prop-types */
// STYLES
import './index.scss';

// TYPES
type Props = {
  isScheduling: boolean;
};

const SchedulingProgressOverlay: React.FC<Props> = ({
  children,
  isScheduling,
}) => {
  return (
    <div className='scheduling-progress-overlay--wrapper'>
      {isScheduling && (
        <div className='scheduling-progress--overlay'>
          <div>Scheduling in progress...</div>
          <div className='scheduling-progress-overlay--meter'>
            <span />
          </div>
        </div>
      )}
      {children}
    </div>
  );
};

export default SchedulingProgressOverlay;
