// COMPONENTS
import JointTeaching from './JointTeaching';
// import ManualScheduling from './ManualScheduling';
import SchedulingStatus from './SchedulingStatus';
import ActionsDropdown from './ActionsDropdown';

// STYLES
import './index.scss';

// TYPES
// import { EActivityStatus } from '../../../../Types/ActivityStatus.enum';
import { TActivity } from 'Types/Activity.type';

type Props = {
  activity: TActivity,
};

const SchedulingActions = ({ activity }: Props) => {
  return (
    <div className='scheduling-actions-column--wrapper'>
      {/* {activity.activityStatus === EActivityStatus.SCHEDULED && (
        <div className='scheduling-actions--strikethrough' />
      )} */}
      <SchedulingStatus activity={activity} />
      {/* <ManualScheduling activity={activity} /> */}
      <JointTeaching activity={activity} />
      <ActionsDropdown activity={activity} />
    </div>
  );
};

export default SchedulingActions;
