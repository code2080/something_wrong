import React from 'react';
import PropTypes from 'prop-types';

// COMPONENTS
import SelectActivityButton from './SelectActivityButton';
import SchedulingCheckbox from './SchedulingCheckbox';
import ActionsDropdown from './ActionsDropdown';

// CONSTANTS
import { activityStatuses } from '../../../../Constants/activityStatuses.constants';

// STYLES
import './SchedulingActions.scss';

const SchedulingActions = ({ activity }) => {
  return (
    <div className='scheduling-actions-column--wrapper'>
      {activity.activityStatus === activityStatuses.COMPLETED && (
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
