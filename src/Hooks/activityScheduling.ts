import { useMemo } from 'react';
import { groupBy, keyBy } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';

// ACTIONS
import {
  scheduleActivities,
  updateActivitiesWithSchedulingResults,
} from '../Utils/scheduling.helpers';
import { updateActivities } from '../Redux/Activities/activities.actions';

// CONSTANTS
import { activityStatuses } from '../Constants/activityStatuses.constants';
import { teCoreSchedulingProgress } from '../Constants/teCoreProps.constants';
import { teCoreCallnames } from '../Constants/teCoreActions.constants';

// COMPONENTS
import { useTECoreAPI } from '../Components/TECoreAPI/withTECoreAPI';
import { selectSubmissions } from '../Redux/FormSubmissions/formSubmissions.selectors';
import SchedulingStatusModal from './schedulingStatusConfirmModal';

// TYPES
import { TFormInstance } from '../Types/FormInstance.type';
import { selectActivitiesForForm } from '../Redux/Activities/activities.selectors';
import { TActivity } from '../Types/Activity.type';
import { EActivityStatus } from '../Types/ActivityStatus.enum';

type Props = {
  formType: string;
  formId: string;
  reservationMode: string;
};
const useActivityScheduling = ({
  formId,
  formType,
  reservationMode,
}: Props) => {
  const dispatch = useDispatch();
  const teCoreAPI = useTECoreAPI();
  const formInstances = useSelector(selectSubmissions)(formId);
  const indexedFormInstances = useMemo(() => keyBy(formInstances, '_id'), [
    formInstances,
  ]);
  const allActivities = useSelector(selectActivitiesForForm)(formId);

  const { openConfirmModal } = SchedulingStatusModal();

  const checkActivitiesInFormInstance = (groupedActivities) => {
    return groupBy(Object.keys(groupedActivities), (formInstanceId) => {
      const unScheduleActivities = (allActivities[formInstanceId] || []).filter(
        (activity: TActivity) =>
          activity.activityStatus === EActivityStatus.NOT_SCHEDULED,
      );
      const fI = indexedFormInstances[formInstanceId] as TFormInstance;

      const activitiesInFormInstance = groupedActivities[formInstanceId];
      switch (fI.teCoreProps.schedulingProgress) {
        // If NOT_SCHEDULED
        case teCoreSchedulingProgress.NOT_SCHEDULED: {
          if (unScheduleActivities.length === activitiesInFormInstance.length)
            return teCoreSchedulingProgress.SCHEDULING_FINISHED;
          if (unScheduleActivities.length > activitiesInFormInstance.length)
            return teCoreSchedulingProgress.IN_PROGRESS;
          return null;
        }

        case teCoreSchedulingProgress.IN_PROGRESS:
          if (unScheduleActivities.length === activitiesInFormInstance.length)
            return teCoreSchedulingProgress.SCHEDULING_FINISHED;
          return null;

        case teCoreSchedulingProgress.SCHEDULING_FINISHED:
          return null;

        default:
          return null;
      }
    });
  };

  const handleScheduleActivities = async (activities) => {
    const groupedActivities = groupBy(
      activities.filter(
        (activity) => activity.activityStatus !== activityStatuses.SCHEDULED,
      ),
      ({ formInstanceId }) => formInstanceId,
    );
    openConfirmModal(checkActivitiesInFormInstance(groupedActivities));
    return Promise.all(
      Object.keys(groupedActivities)
        .filter((formInstanceId) => formInstanceId)
        .map((formInstanceId) => {
          const activitiesOfFormInstance = groupedActivities[formInstanceId];
          return new Promise((resolve) => {
            scheduleActivities(
              activitiesOfFormInstance,
              formType,
              reservationMode,
              teCoreAPI[teCoreCallnames.REQUEST_SCHEDULE_ACTIVITIES],
              (schedulingReturns) => {
                dispatch(
                  updateActivities(
                    formId,
                    formInstanceId,
                    updateActivitiesWithSchedulingResults(
                      activitiesOfFormInstance,
                      schedulingReturns,
                    ),
                  ),
                );
                resolve(null);
              },
            );
          });
        }),
    ).catch((err) => {
      console.log('ERROR', err);
      return err;
    });
  };

  return {
    handleScheduleActivities,
  };
};
export default useActivityScheduling;
