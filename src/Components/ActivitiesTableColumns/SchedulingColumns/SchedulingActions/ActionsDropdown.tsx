import { useCallback, useMemo } from 'react';
import _, { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import { Modal, Dropdown, Menu, Button } from 'antd';
import { DownOutlined, EllipsisOutlined } from '@ant-design/icons';

// HELPERS
import { EActivityStatus } from 'Types/ActivityStatus.enum';
import { selectDesignForForm } from 'Redux/ActivityDesigner/activityDesigner.selectors';
import { activityFilterFn } from 'Utils/activities.helpers';
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
import {
  startSchedulingActivities,
  finishSchedulingActivities,
} from 'Redux/ActivityScheduling/activityScheduling.actions';

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
import { makeSelectAllActivityIdsForForm } from 'Redux/Activities/activities.selectors';
import useActivityScheduling from 'Hooks/activityScheduling';
import { makeSelectForm } from 'Redux/Forms/forms.selectors';

const mapStateToProps = (state, { activity }) => {
  const activities =
    state.activities[activity.formId]?.[activity.formInstanceId] || {};
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
  startSchedulingActivities,
  finishSchedulingActivities,
};

const activityActions = {
  SCHEDULE_ALL: {
    label: 'Schedule submission',
    filterFn: activityFilterFn.canBeScheduled,
    callname: teCoreCallnames.REQUEST_SCHEDULE_ACTIVITIES,
    isDisabled: true, // TODO: SSP: Disabled as it doesn't work with SSP yet
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
    isDisabled: true, // TODO: SSP: Disabled as it doesn't work with SSP yet
    label: 'Cancel all reservations',
    filterFn: activityFilterFn.canBeSelected,
    callname: teCoreCallnames.DELETE_RESERVATIONS,
  },
};

const ActivityActionsDropdown = ({
  buttonType,
  activity,
  jobs,
  mSStatus,
  // TODO: SSP: Change to activityIds instead
  activities,
  updateActivity,
  updateActivities,
  teCoreAPI,
  setFormInstanceSchedulingProgress,
  abortJob,
  isScheduling,
  startSchedulingActivities,
  finishSchedulingActivities,
}) => {
  const { formInstanceId, formId } = activity;
  const mixpanel = useMixpanel();
  const objectRequests = useSelector(selectFormObjectRequest(formId));
  const selectFormInstance = useMemo(() => makeSelectFormInstance(), []);
  const formInstance = useSelector((state) =>
    selectFormInstance(state, { formId, formInstanceId }),
  );
  const selectForm = useMemo(() => makeSelectForm(), []);
  const form = useSelector(state => selectForm(state, formId));
  const { /* handleScheduleActivities, */ handleDeleteActivities } =
  useActivityScheduling({
    formId,
    formType: form?.formType ?? '',
    reservationMode: form?.reservationMode ?? ''
  });
  const selectAllActivityIds = useMemo(() => makeSelectAllActivityIdsForForm(), []);
  const allActivityIds = useSelector(state => selectAllActivityIds(state, formId));
  const activityDesign = useSelector(selectDesignForForm)(formId);
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
      finishSchedulingActivities(
        schedulingReturns.map(({ activityId }) => activityId),
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const activityIds = activities.map(({ _id }) => _id);
    startSchedulingActivities(activityIds);
    trackScheduleActivities(activities);
    const results = scheduleActivities(
      activities,
      formType,
      reservationMode,
      teCoreAPI[activityActions[key].callname],
      onFinishScheduleMultiple,
      objectRequests,
      activityDesign,
    );
    if (!isEmpty(results)) updateSchedulingProgress();
  };

  const handleMenuClick = useCallback(
    ({ key }) => {
      if (!activityActions[key] || !activityActions[key].callname) return;
      switch (key) {
        // TODO: change to ids instead
        case 'SCHEDULE_ALL':
          // TODO: SSP: To be able to do this properly we need the BE to send us a list of all activities and their forminstanceid, or we need to add formInstanceid as a query to the get activities call
          handleScheduleActivities(
            // TODO: SSP: Move this logic inside of handleScheduleActivities
            activities.filter(
              (a) => a.activityStatus !== EActivityStatus.SCHEDULED,
            ),
            key,
          );
          break;
        case 'SCHEDULE':
          handleScheduleActivities([activity._id], key);
          break;
        case 'DELETE':
          teCoreAPI[activityActions[key].callname]({
            activities: [activity],
            callback: onDeleteActivities,
          });
          break;
        case 'DELETE_ALL':
          handleDeleteActivities(allActivityIds);
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
                activityActions[key]?.isDisabled || isScheduling ||
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
  activities: PropTypes.array.isRequired,
  jobs: PropTypes.array.isRequired,
  updateActivity: PropTypes.func.isRequired,
  updateActivities: PropTypes.func.isRequired,
  teCoreAPI: PropTypes.object.isRequired,
  mSStatus: PropTypes.object.isRequired,
  setFormInstanceSchedulingProgress: PropTypes.func.isRequired,
  abortJob: PropTypes.func.isRequired,
  isScheduling: PropTypes.bool,
  startSchedulingActivities: PropTypes.func.isRequired,
  finishSchedulingActivities: PropTypes.func.isRequired,
};

ActivityActionsDropdown.defaultProps = {
  buttonType: 'default',
  isScheduling: false,
};

export default connect(
  mapStateToProps,
  mapActionsToProps,
)(withTECoreAPI(ActivityActionsDropdown));
