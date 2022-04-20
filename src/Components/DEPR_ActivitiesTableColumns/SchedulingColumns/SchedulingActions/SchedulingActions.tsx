import PropTypes from 'prop-types';

// COMPONENTS
// import { selectActivitySchedulingById } from 'Redux/DEPR_ActivityScheduling/activityScheduling.selectors';
import SelectActivityButton from './SelectActivityButton';
import SchedulingCheckbox from './SchedulingCheckbox';
import JointTeachingIcon from './JointTeachingIcon';

// STYLES
import './SchedulingActions.scss';

// TYPES
import { EActivityStatus } from '../../../../Types/Activity/ActivityStatus.enum';

const SchedulingActions = ({ activity, selectedRowKeys }) => {
  // const isScheduling = useSelector(selectActivitySchedulingById(activity._id));

  return (
    <div className='scheduling-actions-column--wrapper'>
      {activity.activityStatus === EActivityStatus.SCHEDULED && (
        <div className='scheduling-actions--strikethrough' />
      )}
      <SchedulingCheckbox activity={activity} />
      <SelectActivityButton activity={activity} />
      <JointTeachingIcon
        activity={activity}
        selectedRowKeys={selectedRowKeys}
      />
    </div>
  );
};

SchedulingActions.propTypes = {
  activity: PropTypes.object.isRequired,
  selectedRowKeys: PropTypes.array,
};

export default SchedulingActions;
