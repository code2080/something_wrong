import PropTypes from 'prop-types';

// COMPONENTS
import SelectActivityButton from './SelectActivityButton';
import SchedulingCheckbox from './SchedulingCheckbox';
import ActionsDropdown from './ActionsDropdown';

// CONSTANTS
import { activityStatuses } from '../../../../Constants/activityStatuses.constants';

// STYLES
import './SchedulingActions.scss';
import { hasPermission } from '../../../../Redux/Auth/auth.selectors';
import { ASSISTED_SCHEDULING_PERMISSION_NAME } from '../../../../Constants/permissions.constants';
import { useSelector } from 'react-redux';

const SchedulingActions = ({ activity }) => {
  const hasAssistedSchedulingPermissions = useSelector(
    hasPermission(ASSISTED_SCHEDULING_PERMISSION_NAME),
  );
  return (
    <div className='scheduling-actions-column--wrapper'>
      {activity.activityStatus === activityStatuses.COMPLETED && (
        <div className='scheduling-actions--strikethrough' />
      )}
      <SchedulingCheckbox
        activity={activity}
        disabled={!hasAssistedSchedulingPermissions}
      />
      <SelectActivityButton
        activity={activity}
        disabled={!hasAssistedSchedulingPermissions}
      />
      <ActionsDropdown buttonType='ellipsis' activity={activity} />
    </div>
  );
};

SchedulingActions.propTypes = {
  activity: PropTypes.object.isRequired,
};

export default SchedulingActions;
