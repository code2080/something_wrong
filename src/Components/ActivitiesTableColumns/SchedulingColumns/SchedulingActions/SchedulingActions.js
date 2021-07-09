import PropTypes from 'prop-types';

// COMPONENTS
import SelectActivityButton from './SelectActivityButton';
import SchedulingCheckbox from './SchedulingCheckbox';
import ActionsDropdown from './ActionsDropdown';

// CONSTANTS
import { EActivityStatus } from '../../../../Types/ActivityStatus.enum';

// STYLES
import './SchedulingActions.scss';

const SchedulingActions = ({ activity }) => {
  return (
    <div className='scheduling-actions-column--wrapper'>
      {activity.activityStatus === EActivityStatus.COMPLETED && (
        <div className='scheduling-actions--strikethrough' />
      )}
      <SchedulingCheckbox activity={activity} />
      <SelectActivityButton activity={activity} />
      <ActionsDropdown buttonType='ellipsis' activity={activity} />
    </div>
  );
};

SchedulingActions.propTypes = {
  activity: PropTypes.object.isRequired,
};

export default SchedulingActions;
