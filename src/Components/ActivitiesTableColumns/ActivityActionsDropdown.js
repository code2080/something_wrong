import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Dropdown, Menu, Button, Icon } from 'antd';

// HELPERS
import {
  scheduleActivity,
  scheduleActivities,
  updateActivityWithSchedulingResult,
  updateActivitiesWithSchedulingResults,
} from '../../Utils/scheduling.helpers';

// ACTIONS
import {
  updateActivity,
  updateActivities
} from '../../Redux/Activities/activities.actions';

// COMPONENTS
import withTECoreAPI from '../TECoreAPI/withTECoreAPI';

// CONSTANTS
import { activityStatuses } from '../../Constants/activityStatuses.constants';
import { teCoreCallnames } from '../../Constants/teCoreActions.constants';

const mapStateToProps = (state, { activity }) => ({
  activities: state.activities[activity.formId][activity.formInstanceId]
});

const mapActionsToProps = {
  updateActivity,
  updateActivities
};

const activityActions = {
  SCHEDULE_ALL: {
    label: 'Schedule all activities',
    filterFn: activity =>
      !activity.reservationId &&
      activity.activityStatus !== activityStatuses.SCHEDULED,
    callname: teCoreCallnames.REQUEST_SCHEDULE_ACTIVITIES
  },
  SCHEDULE: {
    label: 'Schedule activity',
    filterFn: activity =>
      !activity.reservationId &&
      activity.activityStatus !== activityStatuses.SCHEDULED,
    callname: teCoreCallnames.REQUEST_SCHEDULE_ACTIVITIES
  },
  SELECT: {
    label: 'Select reservation',
    filterFn: activity =>
      activity.reservationId &&
      activity.activityStatus !== activityStatuses.NOT_SCHEDULED,
    callname: teCoreCallnames.SELECT_RESERVATION
  },
  DELETE: {
    label: 'Delete reservation',
    filterFn: activity =>
      activity.reservationId &&
      activity.activityStatus !== activityStatuses.NOT_SCHEDULED,
    callname: teCoreCallnames.DELETE_RESERVATION
  }
};

const ActivityActionsDropdown = ({
  buttonType,
  activity,
  activities,
  updateActivity,
  updateActivities,
  teCoreAPI
}) => {
  const onFinishSchedule =
    schedulingReturn => updateActivity(updateActivityWithSchedulingResult(activity, schedulingReturn));

  const onFinishScheduleMultiple = schedulingReturns => {
    updateActivities(
      activity.formId,
      activity.formInstanceId,
      updateActivitiesWithSchedulingResults(activities, schedulingReturns)
    );
  };

  const onDeleteActivity = response => {
    // Check result parameter to see if everything went well or not
    if (!response.result.details) {
      const updatedActivity = {
        ...activity,
        schedulingDate: null,
        activityStatus: activityStatuses.NOT_SCHEDULED,
        reservationId: null,
      };
      updateActivity(updatedActivity);
    }
  };

  const handleMenuClick = useCallback(
    ({ key }) => {
      if (!activityActions[key] || !activityActions[key].callname) return;
      switch (key) {
        case 'SCHEDULE_ALL':
          scheduleActivities(
            activities.filter(
              a => a.activityStatus !== activityStatuses.SCHEDULED
            ),
            teCoreAPI[activityActions[key].callname],
            onFinishScheduleMultiple
          );
          break;
        case 'SCHEDULE':
          scheduleActivities(
            [activity],
            teCoreAPI[activityActions[key].callname],
            onFinishScheduleMultiple
          );
          break;
        case 'DELETE':
          teCoreAPI[activityActions[key].callname]({
            activity,
            callback: onDeleteActivity
          });
          break;
        default:
          teCoreAPI[activityActions[key].callname](activity);
          break;
      }
    },
    [teCoreAPI, activity, onFinishSchedule]
  );

  const menu = useMemo(
    () => (
      <Menu onClick={handleMenuClick}>
        {Object.keys(activityActions)
          .filter(key => activityActions[key].filterFn(activity))
          .map(key => (
            <Menu.Item key={key}>{activityActions[key].label}</Menu.Item>
          ))}
      </Menu>
    ),
    [handleMenuClick]
  );

  return (
    <Dropdown
      overlay={menu}
      trigger={['click']}
      getPopupContainer={() => document.getElementById('te-prefs-lib')}
    >
      {buttonType === 'more' ? (
        <Button type="link" icon="more" size="small" />
      ) : (
        <Button
          type={buttonType}
          size="small"
          style={{ backgroundColor: '#ffffff' }}
        >
          Actions <Icon type="down" />
        </Button>
      )}
    </Dropdown>
  );
};

ActivityActionsDropdown.propTypes = {
  buttonType: PropTypes.string,
  activity: PropTypes.object.isRequired,
  activities: PropTypes.array.isRequired,
  updateActivity: PropTypes.func.isRequired,
  updateActivities: PropTypes.func.isRequired,
  teCoreAPI: PropTypes.object.isRequired
};

ActivityActionsDropdown.defaultProps = {
  buttonType: 'default'
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withTECoreAPI(ActivityActionsDropdown));
