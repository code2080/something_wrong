import PropTypes from 'prop-types';

// COMPONENTS
import SelectActivityButton from './SelectActivityButton';
import SchedulingCheckbox from './SchedulingCheckbox';
import ActionsDropdown from './ActionsDropdown';
import JointTeachingIcon from './JointTeachingIcon';
// CONSTANTS
import { EActivityStatus } from '../../../../Types/ActivityStatus.enum';

// STYLES
import './SchedulingActions.scss';

const SchedulingActions = ({ activity, selectedRowKeys }) => {
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
      <ActionsDropdown buttonType='ellipsis' activity={activity} />
    </div>
  );
};

SchedulingActions.propTypes = {
  activity: PropTypes.object.isRequired,
  selectedRowKeys: PropTypes.array,
};

export default SchedulingActions;
