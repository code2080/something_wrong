import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

// COMPONENTS
// import { selectActivitySchedulingById } from 'Redux/DEPR_ActivityScheduling/activityScheduling.selectors';
import SelectActivityButton from './SelectActivityButton';
import SchedulingCheckbox from './SchedulingCheckbox';
import ActionsDropdown from './ActionsDropdown';
import JointTeachingIcon from './JointTeachingIcon';

// STYLES
import './SchedulingActions.scss';

// TYPES
import { EActivityStatus } from '../../../../Types/Activity/ActivityStatus.enum';

const SchedulingActions = ({ activity, selectedRowKeys, actions }) => {
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
      <ActionsDropdown
        buttonType='ellipsis'
        activity={activity}
        isScheduling={false}
        actions={actions}
      />
    </div>
  );
};

SchedulingActions.propTypes = {
  activity: PropTypes.object.isRequired,
  selectedRowKeys: PropTypes.array,
  actions: PropTypes.array,
};

export default SchedulingActions;
