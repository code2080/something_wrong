import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Icon } from 'antd';

// CONSTANTS
import { activityStatuses, activityStatusProps } from '../../Constants/activityStatuses.constants';

const ActivityStatus = ({ activityStatus, reservationId }) => {
  if (!activityStatus || !activityStatuses[activityStatus]) return null;
  return (
    <Tooltip
      title={activityStatusProps[activityStatus].tooltip(reservationId || null)}
      getPopupContainer={() => document.getElementById('te-prefs-lib')}
    >
      <div className={`activity-status--wrapper ${activityStatuses[activityStatus]}`}>
        <Icon type={activityStatusProps[activityStatus].icon} />
      </div>
    </Tooltip>
  );
};

ActivityStatus.propTypes = {
  activityStatus: PropTypes.string.isRequired,
  reservationId: PropTypes.string,
};

ActivityStatus.defaultProps = {
  reservationId: null,
};

export default ActivityStatus;
