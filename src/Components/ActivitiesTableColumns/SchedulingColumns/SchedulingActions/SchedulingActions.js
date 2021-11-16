import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

// COMPONENTS
import { EActivityStatus } from '../../../../Types/ActivityStatus.enum';
import { selectActivitySchedulingById } from 'Redux/ActivityScheduling/activityScheduling.selectors';
import SelectActivityButton from './SelectActivityButton';
import SchedulingCheckbox from './SchedulingCheckbox';
import ActionsDropdown from './ActionsDropdown';
import JointTeachingIcon from './JointTeachingIcon';
import './SchedulingActions.scss';

const SchedulingActions = ({ activity, selectedRowKeys }) => {
  const isScheduling = useSelector(selectActivitySchedulingById(activity._id));

  return (
    <div className='scheduling-actions-column--wrapper'>
      {activity.activityStatus === EActivityStatus.COMPLETED && (
        <div className='scheduling-actions--strikethrough' />
      )}
      <SchedulingCheckbox activity={activity} />
      <SelectActivityButton activity={activity} />
      <JointTeachingIcon
        activity={activity}
        selectedRowKeys={selectedRowKeys}
      />
      <ActionsDropdown
        buttonType='ellipsis'
        activity={activity}
        isScheduling={isScheduling}
      />
    </div>
  );
};

SchedulingActions.propTypes = {
  activity: PropTypes.object.isRequired,
  selectedRowKeys: PropTypes.array,
};

export default SchedulingActions;
