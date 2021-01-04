import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import { Modal, Dropdown, Menu, Button, Icon } from 'antd';

// HELPERS
import {
  scheduleActivities,
  updateActivityWithSchedulingResult,
  updateActivitiesWithSchedulingResults,
} from '../../Utils/scheduling.helpers';

// ACTIONS
import {
  updateActivity,
  updateActivities
} from '../../Redux/Activities/activities.actions';
import { setFormInstanceSchedulingProgress } from '../../Redux/FormSubmissions/formSubmissions.actions';

// COMPONENTS
import withTECoreAPI from '../TECoreAPI/withTECoreAPI';

// CONSTANTS
import { activityStatuses } from '../../Constants/activityStatuses.constants';
import { teCoreCallnames } from '../../Constants/teCoreActions.constants';
import { teCoreSchedulingProgress } from '../../Constants/teCoreProps.constants';
import { manualSchedulingFormStatuses } from '../../Constants/manualSchedulingConstants';

// SELECTORS
import { selectManualSchedulingStatus } from '../../Redux/ManualSchedulings/manualSchedulings.selectors';

const mapStateToProps = (state, { activity }) => ({
  activities: state.activities[activity.formId][activity.formInstanceId],
  mSStatus: selectManualSchedulingStatus(state)(activity.formInstanceId, activity.formId),
  formInstance: state.submissions[activity.formId][activity.formInstanceId],
});

const mapActionsToProps = {
  updateActivity,
  updateActivities,
  setFormInstanceSchedulingProgress,
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
  },
  DELETE_ALL: {
    label: 'Delete all reservations',
    filterFn: activity => // Should filter look at activities instead?
      activity.reservationId &&
      activity.activityStatus !== activityStatuses.NOT_SCHEDULED,
    callname: teCoreCallnames.DELETE_RESERVATIONS
  }
};

const ActivityActionsDropdown = ({
  buttonType,
  activity,
  mSStatus,
  activities,
  updateActivity,
  updateActivities,
  teCoreAPI,
  formInstance,
  setFormInstanceSchedulingProgress,
}) => {
  const { formInstanceId, formId } = activity;
  const [formType, reservationMode] = useSelector(state => {
    const form = state.forms[formId];
    return [form.formType, form.reservationMode];
  });
  const onFinishSchedule =
    schedulingReturn => updateActivity(updateActivityWithSchedulingResult(activity, schedulingReturn));

  const onFinishScheduleMultiple = schedulingReturns => {
    updateActivities(
      activity.formId,
      activity.formInstanceId,
      updateActivitiesWithSchedulingResults(activities, schedulingReturns)
    );
  };

  const onDeleteReservation = response => {
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

  const onDeleteReservations = response => {
    // Check result parameter to see if everything went well or not
    response.forEach(res => {
      if (!res.result.details) {
        const updatedActivity = {
          ...res.activity,
          schedulingDate: null,
          activityStatus: activityStatuses.NOT_SCHEDULED,
          reservationId: null,
        };
        updateActivity(updatedActivity);
      }
    })
  };

  const updateSchedulingProgress = () => {
    if (mSStatus.status === manualSchedulingFormStatuses.NOT_STARTED && formInstance.teCoreProps.schedulingProgress === teCoreSchedulingProgress.NOT_SCHEDULED)
      Modal.confirm({
        getContainer: () => document.getElementById('te-prefs-lib'),
        title: 'Do you want to update the scheduling progress?',
        content: 'You just marked the first row of this submission as scheduled. Do you want to update the scheduling status to in progress?',
        onOk: () => setFormInstanceSchedulingProgress({ formInstanceId, schedulingProgress: teCoreSchedulingProgress.IN_PROGRESS }),
        onCancel: () => { },
      });
    if (mSStatus.status === manualSchedulingFormStatuses.ONE_AWAY && formInstance.teCoreProps.schedulingProgress !== teCoreSchedulingProgress.SCHEDULING_FINISHED)
      Modal.confirm({
        getContainer: () => document.getElementById('te-prefs-lib'),
        title: 'Do you want to update the scheduling progress?',
        content: 'You just marked the last row of this submission as scheduled. Do you want to update the scheduling status to completed?',
        onOk: () => setFormInstanceSchedulingProgress({ formInstanceId, schedulingProgress: teCoreSchedulingProgress.SCHEDULING_FINISHED }),
        onCancel: () => { },
      });
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
            formType,
            reservationMode,
            teCoreAPI[activityActions[key].callname],
            onFinishScheduleMultiple
          );
          updateSchedulingProgress();
          break;
        case 'SCHEDULE':
          scheduleActivities(
            [activity],
            formType,
            reservationMode,
            teCoreAPI[activityActions[key].callname],
            onFinishScheduleMultiple
          );
          updateSchedulingProgress();
          break;
        case 'DELETE':
          teCoreAPI[activityActions[key].callname]({
            activity,
            callback: onDeleteReservation
          });
          break;
        case 'DELETE_ALL':
          teCoreAPI[activityActions[key].callname]({
            activities,
            callback: onDeleteReservations
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
  teCoreAPI: PropTypes.object.isRequired,
  formInstance: PropTypes.object.isRequired,
  mSStatus: PropTypes.object.isRequired,
  setFormInstanceSchedulingProgress: PropTypes.func.isRequired,
};

ActivityActionsDropdown.defaultProps = {
  buttonType: 'default'
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withTECoreAPI(ActivityActionsDropdown));
