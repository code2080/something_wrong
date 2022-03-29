import { Button } from 'antd';
import { useSelector } from 'react-redux';

// COMPONENTS
import SchedulingProgressMeter from 'Components/SchedulingProgressMeter';

// REDUX
import { hasPermission } from 'Redux/Auth/auth.selectors';

// HOOKS
import useSSP from 'Components/SSP/Utils/hooks';
import { useScheduling } from 'Hooks/useScheduling';

// CONSTANTS
import { ASSISTED_SCHEDULING_PERMISSION_NAME } from 'Constants/permissions.constants';

// STYLES
import './index.scss';


const JobToolbar = () => {
  const { selectedKeys } = useSSP();
  const { scheduleSelectedActivities } = useScheduling();
  /**
   * SELECTORS
   */
  const hasSchedulingPermissions = useSelector(hasPermission(ASSISTED_SCHEDULING_PERMISSION_NAME));

  const onClickHandler = () => {
    scheduleSelectedActivities(selectedKeys);
  };

  return (
    <div className="job-toolbar--wrapper">
      <Button
        type="primary"
        size='small'
        className='schedule-btn--wrapper'
        onClick={onClickHandler}
        disabled={!selectedKeys?.length || !hasSchedulingPermissions} // should add condition for if job is running
      >
        Schedule
      </Button>
      <SchedulingProgressMeter />
    </div>
  );
};

export default JobToolbar;