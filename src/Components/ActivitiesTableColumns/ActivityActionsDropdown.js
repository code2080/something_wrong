import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Dropdown, Menu, Button, Icon } from 'antd';

// ACTIONS
import { scheduleActivity } from '../../Redux/Activities/activities.actions';

// COMPONENTS
import withTECoreAPI from '../TECoreAPI/withTECoreAPI';

// CONSTANTS
import { activityStatuses } from '../../Constants/activityStatuses.constants';

const mapActionsToProps = {
  scheduleActivity,
};

const activityActions = {
  SCHEDULE: {
    label: 'Schedule activity',
    filterFn: activity => !activity.reservationId && activity.activityStatus === activityStatuses.NOT_SCHEDULED,
  },
  SELECT: {
    label: 'Select activity',
    filterFn: activity => activity.reservationId && activity.activityStatus !== activityStatuses.NOT_SCHEDULED,
    callname: 'selectReservation',
  },
  DELETE: {
    label: 'Delete activity',
    filterFn: activity => activity.reservationId && activity.activityStatus !== activityStatuses.NOT_SCHEDULED,
    callname: 'deleteReservation',
  },
}

const ActivityActionsDropdown = ({
  buttonType,
  activity,
  scheduleActivity,
  teCoreAPI,
}) => {
  const handleMenuClick = useCallback(({ key }) => {
    if (activityActions[key] && activityActions[key].callname)
      teCoreAPI[activityActions[key].callname](activity);

    if (key === 'SCHEDULE') {
      scheduleActivity({ api: teCoreAPI, activity });
    }
  }, [teCoreAPI, activity]);

  const menu = useMemo(() => (
    <Menu onClick={handleMenuClick}>
      {Object.keys(activityActions)
        .filter(key => activityActions[key].filterFn(activity))
        .map(key => (
          <Menu.Item key={key}>{activityActions[key].label}</Menu.Item>
        ))}
    </Menu>
  ), [handleMenuClick]);

  return (
    <Dropdown
      overlay={menu}
      trigger={['click']}
      getPopupContainer={() => document.getElementById('te-prefs-lib')}
    >
      {buttonType === 'more' ? (
        <Button type="link" icon="more" size="small" />
      ) : (
        <Button type={buttonType} size="small" style={{ backgroundColor: '#ffffff' }}>
          Actions <Icon type="down" />
        </Button>
      )}
    </Dropdown>
  );
};

ActivityActionsDropdown.propTypes = {
  buttonType: PropTypes.string,
  activity: PropTypes.object.isRequired,
  scheduleActivity: PropTypes.func.isRequired,
  teCoreAPI: PropTypes.object.isRequired,
};

ActivityActionsDropdown.defaultProps = {
  buttonType: 'default',
};

export default connect(null, mapActionsToProps)(withTECoreAPI(ActivityActionsDropdown));
