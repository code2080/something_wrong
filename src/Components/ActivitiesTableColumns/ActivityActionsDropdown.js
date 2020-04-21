import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Dropdown, Menu, Button, Icon } from 'antd';

// HELPERS
import { scheduleActivity } from '../../Utils/scheduling.helpers';

// ACTIONS
import { updateActivity } from '../../Redux/Activities/activities.actions';

// COMPONENTS
import withTECoreAPI from '../TECoreAPI/withTECoreAPI';

// CONSTANTS
import { activityStatuses } from '../../Constants/activityStatuses.constants';
import { teCoreCallnames } from '../../Constants/teCoreActions.constants';

const mapActionsToProps = {
  updateActivity,
};

const activityActions = {
  SCHEDULE: {
    label: 'Schedule activity',
    filterFn: activity => !activity.reservationId && activity.activityStatus === activityStatuses.NOT_SCHEDULED,
    callname: teCoreCallnames.REQUEST_SCHEDULE_ACTIVITY,
  },
  SELECT: {
    label: 'Select activity',
    filterFn: activity => activity.reservationId && activity.activityStatus !== activityStatuses.NOT_SCHEDULED,
    callname: teCoreCallnames.SELECT_RESERVATION,
  },
  DELETE: {
    label: 'Delete activity',
    filterFn: activity => activity.reservationId && activity.activityStatus !== activityStatuses.NOT_SCHEDULED,
    callname: teCoreCallnames.DELETE_RESERVATION,
  },
}

const ActivityActionsDropdown = ({
  buttonType,
  activity,
  updateActivity,
  teCoreAPI,
}) => {
  const onFinishSchedule = response => {
    console.log(response);
    const { status: activityStatus, reservationId } = response;
    const updatedActivity = {
      ...activity,
      activityStatus,
      reservationId,
    };
    updateActivity(updatedActivity);
  }

  const handleMenuClick = useCallback(({ key }) => {
    if (!activityActions[key] || !activityActions[key].callname) return;
    switch (key) {
      case 'SCHEDULE':
        scheduleActivity(activity, teCoreAPI[activityActions[key].callname], onFinishSchedule);
        break;
      default:
        teCoreAPI[activityActions[key].callname](activity);
        break;
    }
  }, [teCoreAPI, activity, onFinishSchedule]);

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
  updateActivity: PropTypes.func.isRequired,
  teCoreAPI: PropTypes.object.isRequired,
};

ActivityActionsDropdown.defaultProps = {
  buttonType: 'default',
};

export default connect(null, mapActionsToProps)(withTECoreAPI(ActivityActionsDropdown));
