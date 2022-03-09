/* eslint-disable react/prop-types */
import { useCallback, useMemo } from 'react';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import { Modal, Dropdown, Menu, Button } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';

// REDUX
import { selectActivitySchedulingById } from 'Redux/ActivityScheduling/activityScheduling.selectors';
import { selectManualSchedulingStatus } from '../../../../../Redux/ManualSchedulings/manualSchedulings.selectors';
import { selectJobForActivities } from '../../../../../Redux/Jobs/jobs.selectors';
import { abortJob } from 'Redux/Jobs/jobs.actions';
import { hasPermission } from '../../../../../Redux/Auth/auth.selectors';
import { makeSelectFormInstance } from '../../../../../Redux/FormSubmissions/formSubmissions.selectors';
import { makeSelectForm } from 'Redux/Forms/forms.selectors';
import { setFormInstanceSchedulingProgress } from '../../../../../Redux/FormSubmissions/formSubmissions.actions';

// HELPERS
import { activityFilterFn } from 'Utils/activities.helpers';
import { useTECoreAPI } from 'Hooks/TECoreApiHooks';

// CONSTANTS
import { teCoreCallnames } from '../../../../../Constants/teCoreActions.constants';
import { teCoreSchedulingProgress } from '../../../../../Constants/teCoreProps.constants';
import { manualSchedulingFormStatuses } from '../../../../../Constants/manualSchedulingConstants';
import { ASSISTED_SCHEDULING_PERMISSION_NAME } from '../../../../../Constants/permissions.constants';
import { TActivity } from 'Types/Activity.type';

// TYPES
type Props = {
  activity: TActivity;
  actions?: { [x: string]: Function };
};

const ActivityActionsDropdown = ({ activity, actions = {} }: Props) => {
  const { formInstanceId, formId } = activity;
  const teCoreAPI = useTECoreAPI();

  /**
   * SELECTORS
   */
  const jobs = useSelector(
    selectJobForActivities(activity.formId, [activity._id]),
  );
  const selectFormInstance = useMemo(() => makeSelectFormInstance(), []);
  const formInstance = useSelector((state) =>
    selectFormInstance(state, { formId, formInstanceId }),
  );

  const selectForm = useMemo(() => makeSelectForm(), []);
  const { formType = '', reservationMode = '' } = useSelector((state) =>
    selectForm(state, formId),
  );
  const isScheduling = useSelector(selectActivitySchedulingById(activity._id));

  const mSStatus: any = useSelector(
    selectManualSchedulingStatus(activity.formInstanceId, activity.formId),
  );

  const activityActions = {
    SCHEDULE_SUBMISSION: {
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
    CANCEL: {
      label: 'Cancel reservation',
      filterFn: activityFilterFn.canBeSelected,
      callname: teCoreCallnames.DELETE_RESERVATIONS,
    },
    STOP_SCHEDULING: {
      label: 'Stop scheduling',
      filterFn: activityFilterFn.canBeStopped,
      callname: teCoreCallnames.STOP_SCHEDULING,
    },
    CANCEL_ON_SUBMISSION: {
      label: 'Cancel all reservations from the submission',
      filterFn: activityFilterFn.canBeSelected,
      callname: teCoreCallnames.DELETE_RESERVATIONS,
    },
  };

  const handleScheduleActivities = (activityIds: string[]) => {
    if (typeof actions.onSchedule === 'function') {
      actions.onSchedule(activityIds);
    }
  };

  const handleScheduleActivitiesByFormInstanceId = (formInstanceId: string) => {
    if (typeof actions.onScheduleByFormInstanceId === 'function') {
      actions.onScheduleByFormInstanceId(formInstanceId);
    }
  };

  const handleDeleteActivitiesByFormInstanceId = (formInstanceId: string) => {
    if (typeof actions.onDeleteByFormInstanceId === 'function') {
      actions.onDeleteByFormInstanceId(formInstanceId);
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
  ]);

  const handleMenuClick = useCallback(
    ({ key }) => {
      if (!activityActions[key] || !activityActions[key].callname) return;
      switch (key) {
        case 'SCHEDULE_SUBMISSION':
          handleScheduleActivitiesByFormInstanceId(formInstanceId);
          break;
        case 'SCHEDULE':
          handleScheduleActivities([activity._id]);
          break;
        case 'CANCEL':
          handleDeleteActivities([activity._id]);
          break;
        case 'CANCEL_ON_SUBMISSION':
          handleDeleteActivitiesByFormInstanceId(formInstanceId);
          break;
        case 'STOP_SCHEDULING':
          abortJob({ formId });
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
      <Button type='link' icon={<EllipsisOutlined />} size='small' />
    </Dropdown>
  );
};

export default ActivityActionsDropdown;
