import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';

// CONSTANTS
import { activityStatuses } from '../../../../Constants/activityStatuses.constants';

const getClassNameForSchedulingStatus = (activityStatus, showInvertedState) => {
  if (showInvertedState) {
    if (activityStatus === activityStatuses.SCHEDULED) return activityStatuses.NOT_SCHEDULED;
    return activityStatuses.SCHEDULED;
  } else {
    return activityStatus !== activityStatuses.SCHEDULED ? activityStatuses.NOT_SCHEDULED : activityStatuses.SCHEDULED;
  }
};

const SchedulingCheckbox = ({ activity }) => {
  const [showInvertedState, setShowInvertedState] = useState(false);

  const onUpdateSchedulingStatus = () => {
    console.log('should update scheduling status');
  };

  const derivedSchedulingStatus = getClassNameForSchedulingStatus(activity.activityStatus, showInvertedState);

  return (
    <div
      onMouseEnter={() => setShowInvertedState(true)}
      onMouseLeave={() => setShowInvertedState(false)}
      onClick={onUpdateSchedulingStatus}
      className={`scheduling-actions--status ${derivedSchedulingStatus}`}
    >
      {derivedSchedulingStatus !== activityStatuses.SCHEDULED && (
        <Icon type="minus-square" />
      )}
      {derivedSchedulingStatus === activityStatuses.SCHEDULED && (
        <Icon type="check-square" />
      )}
    </div>
  );
};

SchedulingCheckbox.propTypes = {
  activity: PropTypes.object.isRequired,
};

export default SchedulingCheckbox;
