import { useCallback, useMemo } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import { Modal, Dropdown, Menu, Button } from 'antd';
import { DownOutlined, EllipsisOutlined } from '@ant-design/icons';

// HELPERS
import {
  scheduleActivities,
  updateActivitiesWithSchedulingResults,
} from '../../../../Utils/scheduling.helpers';

// ACTIONS
import {
  updateActivity,
  updateActivities,
} from '../../../../Redux/Activities/activities.actions';
import { setFormInstanceSchedulingProgress } from '../../../../Redux/FormSubmissions/formSubmissions.actions';
import { abortJob } from '../../../../Redux/Jobs/jobs.actions';

// COMPONENTS
import withTECoreAPI from '../../../TECoreAPI/withTECoreAPI';

// CONSTANTS
import { teCoreCallnames } from '../../../../Constants/teCoreActions.constants';
import { teCoreSchedulingProgress } from '../../../../Constants/teCoreProps.constants';
import { manualSchedulingFormStatuses } from '../../../../Constants/manualSchedulingConstants';

// SELECTORS
import { selectManualSchedulingStatus } from '../../../../Redux/ManualSchedulings/manualSchedulings.selectors';
import { selectJobForActivities } from '../../../../Redux/Jobs/jobs.selectors';
import { hasPermission } from '../../../../Redux/Auth/auth.selectors';
import { ASSISTED_SCHEDULING_PERMISSION_NAME } from '../../../../Constants/permissions.constants';
import { makeSelectFormInstance } from '../../../../Redux/FormSubmissions/formSubmissions.selectors';
import { useMixpanel } from '../../../../Hooks/TECoreApiHooks';
import { selectFormObjectRequest } from '../../../../Redux/ObjectRequests/ObjectRequestsNew.selectors';
import { TActivity } from '../../../../Types/Activity.type';
import { EActivityStatus } from 'Types/ActivityStatus.enum';

const mapStateToProps = (state, { activity }) => {
  const activities = state.activities[activity.formId][activity.formInstanceId];
  const jobs = selectJobForActivities(activity.formId, [activity._id])(state);
  return {
    activities,
    jobs,
    mSStatus: selectManualSchedulingStatus(state)(
      activity.formInstanceId,
      activity.formId,
    ),
  };
};

const mapActionsToProps = {
  updateActivity,
  updateActivities,
  setFormInstanceSchedulingProgress,
  abortJob,
};

const activityActions = {
  SCHEDULE_ALL: {
    label: 'Schedule submission',
    filterFn: (activity) => !activity.reservationId,
    callname: teCoreCallnames.REQUEST_SCHEDULE_ACTIVITIES,
  },
  SCHEDULE: {
    label: 'Schedule activity',
    filterFn: (activity) => !activity.reservationId,
    callname: teCoreCallnames.REQUEST_SCHEDULE_ACTIVITIES,
  },
  SELECT: {
    label: 'Select reservation',
    filterFn: (activity) =>
      activity.reservationId &&
      activity.activityStatus !== EActivityStatus.NOT_SCHEDULED,
    callname: teCoreCallnames.SELECT_RESERVATION,
  },
  DELETE: {
    label: 'Delete reservation',
    filterFn: (activity) =>
      activity.reservationId &&
      activity.activityStatus !== EActivityStatus.NOT_SCHEDULED,
    callname: teCoreCallnames.DELETE_RESERVATIONS,
  },
  STOP_SCHEDULING: {
    label: 'Stop scheduling',
    filterFn: (activity) => activity.activityStatus === EActivityStatus.QUEUED,
    callname: teCoreCallnames.STOP_SCHEDULING,
  },
  DELETE_ALL: {
    label: 'Delete all reservations',
    filterFn: (
      activity, // Should filter look at activities instead?
    ) =>
      activity.reservationId &&
      activity.activityStatus !== EActivityStatus.NOT_SCHEDULED,
    callname: teCoreCallnames.DELETE_RESERVATIONS,
  },
};

const ActivityActionsDropdown = ({
  buttonType,
  activity,
  jobs,
  mSStatus,
  activities,
  updateActivity,
  updateActivities,
  teCoreAPI,
  setFormInstanceSchedulingProgress,
  abortJob,
}) => {
  const { formInstanceId, formId } = activity;
  const mixpanel = useMixpanel();
  const objectRequests = useSelector(selectFormObjectRequest(formId));
  const selectFormInstance = useMemo(() => makeSelectFormInstance(), []);
  const formInstance = useSelector((state) =>
    selectFormInstance(state, { formId, formInstanceId }),
  );
  const [formType, reservationMode] = useSelector((state: any) => {
    const form = state.forms[formId];
    return [form.formType, form.reservationMode];
  });
  const hasAssistedSchedulingPermissions = useSelector(
    hasPermission(ASSISTED_SCHEDULING_PERMISSION_NAME),
  );

  const onFinishScheduleMultiple = useCallback(
    (schedulingReturns) => {
      updateActivities(
        activity.formId,
        activity.formInstanceId,
        updateActivitiesWithSchedulingResults(activities, schedulingReturns),
      );
    },
    [activities, activity.formId, activity.formInstanceId, updateActivities],
  );

  const onDeleteActivities = useCallback(
    (responses) => {
      // Check result parameter to see if everything went well or not
      responses.forEach((res) => {
        if (!_.get(res, 'result.details')) {
          const updatedActivity = {
            ...res.activity,
            schedulingDate: null,
            activityStatus: EActivityStatus.NOT_SCHEDULED,
            reservationId: null,
          };
          updateActivity(updatedActivity);
        }
      });
    },
    [updateActivity],
  );

  const updateSchedulingProgress = useCallback(() => {
    if (
      mSStatus.status === manualSchedulingFormStatuses.NOT_STARTED &&
      formInstance?.teCoreProps?.schedulingProgress ===
        teCoreSchedulingProgress.NOT_SCHEDULED
    ) {
      Modal.confirm({
        getContainer: () =>
          document.getElementById('te-prefs-lib') as HTMLElement,
        title: 'Do you want to update the scheduling progress?',
        content:
          'You just marked the first row of this submission as scheduled. Do you want to update the scheduling status to in progress?',
        onOk: () =>
          setFormInstanceSchedulingProgress({
            formInstanceId,
            schedulingProgress: teCoreSchedulingProgress.IN_PROGRESS,
          }),
        onCancel: () => {},
      });
    }
    if (
      mSStatus.status === manualSchedulingFormStatuses.ONE_AWAY &&
      formInstance?.teCoreProps?.schedulingProgress !==
        teCoreSchedulingProgress.SCHEDULING_FINISHED
    ) {
      Modal.confirm({
        getContainer: () =>
          document.getElementById('te-prefs-lib') as HTMLElement,
        title: 'Do you want to update the scheduling progress?',
        content:
          'You just marked the last row of this submission as scheduled. Do you want to update the scheduling status to completed?',
        onOk: () =>
          setFormInstanceSchedulingProgress({
            formInstanceId,
            schedulingProgress: teCoreSchedulingProgress.SCHEDULING_FINISHED,
          }),
        onCancel: () => {},
      });
    }
  }, [
    formInstance?.teCoreProps?.schedulingProgress,
    formInstanceId,
    mSStatus?.status,
    setFormInstanceSchedulingProgress,
  ]);

  const trackScheduleActivities = (activities: TActivity[] = []) => {
    mixpanel?.track('scheduleActivitiesAction', {
      formId: _.first(activities)?.formId,
      nrOfActivities: activities.length,
    });
  };

  const handleScheduleActivities = (activities: TActivity[], key: string) => {
    trackScheduleActivities(activities);
    scheduleActivities(
      activities,
      formType,
      reservationMode,
      teCoreAPI[activityActions[key].callname],
      onFinishScheduleMultiple,
      objectRequests,
    );
    updateSchedulingProgress();
  };

  const handleMenuClick = useCallback(
    ({ key }) => {
      if (!activityActions[key] || !activityActions[key].callname) return;
      switch (key) {
        case 'SCHEDULE_ALL':
          handleScheduleActivities(
            activities.filter(
              (a) => a.activityStatus !== EActivityStatus.SCHEDULED,
            ),
            key,
          );
          break;
        case 'SCHEDULE':
          handleScheduleActivities([activity], key);
          break;
        case 'DELETE':
          teCoreAPI[activityActions[key].callname]({
            activities: [activity],
            callback: onDeleteActivities,
          });
          break;
        case 'DELETE_ALL':
          teCoreAPI[activityActions[key].callname]({
            activities,
            callback: onDeleteActivities,
          });
          break;
        case 'STOP_SCHEDULING':
          jobs.forEach((job) => {
            abortJob({
              jobId: job._id,
              formId,
              formInstanceId,
              activities: [activity],
            });
          });
          break;
        default:
          teCoreAPI[activityActions[key].callname](activity);
          break;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      abortJob,
      activities,
      activity,
      formId,
      formInstanceId,
      formType,
      jobs,
      onDeleteActivities,
      onFinishScheduleMultiple,
      reservationMode,
      teCoreAPI,
      updateSchedulingProgress,
    ],
  );

  const menu = useMemo(
    () => (
      <Menu onClick={handleMenuClick}>
        {Object.keys(activityActions)
          .filter((key) => activityActions[key].filterFn(activity))
          .map((key) => (
            <Menu.Item
              disabled={
                ['SCHEDULE', 'SCHEDULE_ALL'].includes(key) &&
                !hasAssistedSchedulingPermissions
              }
              key={key}
            >
              {activityActions[key].label}
            </Menu.Item>
          ))}
      </Menu>
    ),
    [handleMenuClick, activity, hasAssistedSchedulingPermissions],
  );
  return (
    <Dropdown
      overlay={menu}
      trigger={['click']}
      getPopupContainer={() =>
        document.getElementById('te-prefs-lib') as HTMLElement
      }
    >
      {buttonType === 'ellipsis' ? (
        <Button type='link' icon={<EllipsisOutlined />} size='small' />
      ) : (
        <Button
          type={buttonType}
          size='small'
          style={{ backgroundColor: '#ffffff' }}
        >
          Actions <DownOutlined />
        </Button>
      )}
    </Dropdown>
  );
};

ActivityActionsDropdown.propTypes = {
  buttonType: PropTypes.string,
  activity: PropTypes.object.isRequired,
  activities: PropTypes.array.isRequired,
  jobs: PropTypes.array.isRequired,
  updateActivity: PropTypes.func.isRequired,
  updateActivities: PropTypes.func.isRequired,
  teCoreAPI: PropTypes.object.isRequired,
  mSStatus: PropTypes.object.isRequired,
  setFormInstanceSchedulingProgress: PropTypes.func.isRequired,
  abortJob: PropTypes.func.isRequired,
};

ActivityActionsDropdown.defaultProps = {
  buttonType: 'default',
};

export default connect(
  mapStateToProps,
  mapActionsToProps,
)(withTECoreAPI(ActivityActionsDropdown));
