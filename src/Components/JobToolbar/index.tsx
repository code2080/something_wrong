import { Button } from 'antd';
import { useSelector } from 'react-redux';

// COMPONENTS
import SchedulingProgressMeter from 'Components/SchedulingProgressMeter';
import StartJobModal from 'Components/StartJobModal';
import { useState } from 'react';

// REDUX
import { hasPermission } from 'Redux/Auth/auth.selectors';

// HOOKS
import useSSP from 'Components/SSP/Utils/hooks';

// CONSTANTS
import { ASSISTED_SCHEDULING_PERMISSION_NAME } from 'Constants/permissions.constants';

// STYLES
import './index.scss';

const JobToolbar = () => {
  const { selectedKeys } = useSSP();
  const hasSchedulingPermissions = useSelector(
    hasPermission(ASSISTED_SCHEDULING_PERMISSION_NAME),
  );

  const [startJobModalVisible, setStartJobModalVisible] = useState(false);

  const toggleStartJobModal = () => {
    setStartJobModalVisible((z) => !z);
  };

  return (
    <>
      <div className='job-toolbar--wrapper'>
        <Button
          type='primary'
          size='small'
          className='schedule-btn--wrapper'
          onClick={toggleStartJobModal}
          disabled={!selectedKeys?.length || !hasSchedulingPermissions} // should add condition for if job is running
        >
          Schedule
        </Button>
        <SchedulingProgressMeter />
      </div>

      <StartJobModal
        title='Schedule'
        visible={startJobModalVisible}
        onCancel={() => setStartJobModalVisible(false)}
      />
    </>
  );
};

export default JobToolbar;
