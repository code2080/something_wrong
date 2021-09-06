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
import { useSelector } from 'react-redux';
import { selectIsBetaOrDev } from '../../../../Redux/Auth/auth.selectors';

const SchedulingActions = ({ activity, selectedRowKeys }) => {
  const isBeta = useSelector(selectIsBetaOrDev);

  return (
    <div className='scheduling-actions-column--wrapper'>
      {activity.activityStatus === EActivityStatus.COMPLETED && (
        <div className='scheduling-actions--strikethrough' />
      )}
      <SchedulingCheckbox activity={activity} />
      <SelectActivityButton activity={activity} />
      {isBeta && (
        <JointTeachingIcon
          activity={activity}
          selectedRowKeys={selectedRowKeys}
        />
      )}
      <ActionsDropdown buttonType='ellipsis' activity={activity} />
    </div>
  );
};

SchedulingActions.propTypes = {
  activity: PropTypes.object.isRequired,
  selectedRowKeys: PropTypes.array,
};

export default SchedulingActions;
