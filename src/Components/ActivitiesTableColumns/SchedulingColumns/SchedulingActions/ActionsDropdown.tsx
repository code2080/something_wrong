import { useCallback, useMemo } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import { Modal, Dropdown, Menu, Button } from 'antd';
import { DownOutlined, EllipsisOutlined } from '@ant-design/icons';

// HELPERS
import { activityFilterFn } from 'Utils/activities.helpers';

// ACTIONS
import {
  updateActivity,
  updateActivities,
} from '../../../../Redux/Activities/activities.actions';
import { abortJob } from '../../../../Redux/Jobs/jobs.actions';
import {
  startSchedulingActivities,
  finishSchedulingActivities,
} from 'Redux/ActivityScheduling/activityScheduling.actions';

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
import { makeSelectForm } from 'Redux/Forms/forms.selectors';
import { makeSelectAllActivityidsForForminstance } from 'Redux/ActivityScheduling/activityScheduling.selectors';
import { useTECoreAPI } from 'Hooks/TECoreApiHooks';

const mapStateToProps = (state, { activity }) => {
  const jobs = selectJobForActivities(activity.formId, [activity._id])(state);
  return {
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
  abortJob,
  startSchedulingActivities,
  finishSchedulingActivities,
};

const activityActions = {
  SCHEDULE_ALL: {
    label: 'Schedule submission',
    filterFn: activityFilterFn.canBeScheduled,
    callname: teCoreCallnames.REQUEST_SCHEDULE_ACTIVITIES,
  },
  SCHEDULE: {
    label: 'Schedule activity',
    filterFn: activityFilterFn.canBeScheduled,
    callname: teCoreCallnames.REQUEST_SCHEDULE_ACTIVITIES,
  },
  SELECT: {
    label: 'Select reservation',
    filterFn: activityFilterFn.canBeSelected,
    callname: teCoreCallnames.SELECT_RESERVATION,
  },
  DELETE: {
    label: 'Cancel reservation',
    filterFn: activityFilterFn.canBeSelected,
    callname: teCoreCallnames.DELETE_RESERVATIONS,
  },
  STOP_SCHEDULING: {
    label: 'Stop scheduling',
    filterFn: activityFilterFn.canBeStopped,
    callname: teCoreCallnames.STOP_SCHEDULING,
  },
  DELETE_ALL: {
    label: 'Cancel all reservations from the submission',
    filterFn: activityFilterFn.canBeSelected,
    callname: teCoreCallnames.DELETE_RESERVATIONS,
  },
};

const ActivityActionsDropdown = ({
  buttonType,
  activity,
  jobs,
  mSStatus,
  setFormInstanceSchedulingProgress,
  abortJob,
  isScheduling,
  actions,
}) => {
  const { formInstanceId, formId } = activity;
  const teCoreAPI = useTECoreAPI();
  const selectFormInstance = useMemo(() => makeSelectFormInstance(), []);
  const formInstance = useSelector((state) =>
    selectFormInstance(state, { formId, formInstanceId }),
  );
  const selectAllActivityIdsByFormInstance = useMemo(
    () => makeSelectAllActivityidsForForminstance(),
    [],
  );

  const activitiesByFormInstance = useSelector((state) =>
    selectAllActivityIdsByFormInstance(state, formId, formInstanceId),
  );

  const selectForm = useMemo(() => makeSelectForm(), []);
  const { formType = '', reservationMode = '' } = useSelector((state) =>
    selectForm(state, formId),
  );

  const handleScheduleActivities = (activityIds: string[]) => {
    if (typeof actions.onSchedule === 'function') {
      actions.onSchedule(activityIds);
    }
  };

  const handleScheduleActivitiesByFormInstanceId = (formInstanceId: string) => {
    if (typeof actions.onSchedule === 'function') {
      actions.onScheduleByFormInstanceId(formInstanceId);
    }
  };

  const handleDeleteActivities = (activityIds: string[]) => {
    if (typeof actions.onDelete === 'function') {
      actions.onDelete(activityIds);
    }
  };

  const hasAssistedSchedulingPermissions = useSelector(
    hasPermission(ASSISTED_SCHEDULING_PERMISSION_NAME),
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
        onCancel: _.noop,
      });
    }
  }, [
    formInstance?.teCoreProps?.schedulingProgress,
    formInstanceId,
    mSStatus?.status,
    setFormInstanceSchedulingProgress,
  ]);

  const handleMenuClick = useCallback(
    ({ key }) => {
      if (!activityActions[key] || !activityActions[key].callname) return;
      switch (key) {
        case 'SCHEDULE_ALL':
          handleScheduleActivitiesByFormInstanceId(formInstanceId);
          break;
        case 'SCHEDULE':
          handleScheduleActivities([activity._id]);
          break;
        case 'DELETE':
          handleDeleteActivities([activity._id]);
          break;
        case 'DELETE_ALL':
          handleDeleteActivities(activitiesByFormInstance);
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
      activity,
      formId,
      formInstanceId,
      formType,
      jobs,
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
                isScheduling ||
                (['SCHEDULE', 'SCHEDULE_ALL'].includes(key) &&
                  !hasAssistedSchedulingPermissions)
              }
              key={key}
            >
              {activityActions[key].label}
            </Menu.Item>
          ))}
      </Menu>
    ),
    [handleMenuClick, activity, hasAssistedSchedulingPermissions, isScheduling],
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
  jobs: PropTypes.array.isRequired,
  mSStatus: PropTypes.object.isRequired,
  setFormInstanceSchedulingProgress: PropTypes.func.isRequired,
  abortJob: PropTypes.func.isRequired,
  isScheduling: PropTypes.bool,
  actions: PropTypes.object,
};

ActivityActionsDropdown.defaultProps = {
  buttonType: 'default',
  isScheduling: false,
};

export default connect(
  mapStateToProps,
  mapActionsToProps,
)(ActivityActionsDropdown);
