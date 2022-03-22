// COMPONENTS
import JointTeaching from './JointTeaching';
import ManualScheduling from './ManualScheduling';
import Status from './Status';

// STYLES
import './index.scss';

// TYPES
import { TActivity } from 'Types/Activity/Activity.type';

type Props = {
  activity: TActivity;
};

const SchedulingActions = ({ activity }: Props) => {
  return (
    <div className='scheduling-actions-column--wrapper'>
      <Status activity={activity} />
      <ManualScheduling activity={activity} />
      <JointTeaching activity={activity} />
    </div>
  );
};

export default SchedulingActions;
