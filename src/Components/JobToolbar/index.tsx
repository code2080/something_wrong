import { Button } from 'antd';
import SchedulingProgressMeter from 'Components/SchedulingProgressMeter';

// STYLES
import './index.scss';

const JobToolbar = () => {
  const onClickHandler = () => {
    console.log('APP-827 goes here')
  };

  return (
    <div className="job-toolbar--wrapper">
      <Button type="primary" size='small' className='schedule-btn--wrapper' onClick={onClickHandler}>
        Schedule
      </Button>
      <SchedulingProgressMeter />
    </div>
  );
};

export default JobToolbar;