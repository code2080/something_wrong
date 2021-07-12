import { useMemo } from 'react';
import { flatten, groupBy, isEmpty, keyBy } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';

// ACTIONS
import {
  scheduleActivities,
  updateActivitiesWithSchedulingResults,
} from '../Utils/scheduling.helpers';
import { updateActivities } from '../Redux/Activities/activities.actions';

// CONSTANTS
import { teCoreSchedulingProgress } from '../Constants/teCoreProps.constants';
import { teCoreCallnames } from '../Constants/teCoreActions.constants';

// COMPONENTS
import { makeSelectSubmissions } from '../Redux/FormSubmissions/formSubmissions.selectors';
import SchedulingStatusModal from './schedulingStatusConfirmModal';

// TYPES
import { TFormInstance } from '../Types/FormInstance.type';
import { makeSelectActivitiesForForm } from '../Redux/Activities/activities.selectors';
import { TActivity } from '../Types/Activity.type';
import { EActivityStatus } from '../Types/ActivityStatus.enum';
import { ActivityValueValidation } from '../Types/ActivityValueValidation.type';

// HOOKS
import { useTECoreAPI } from '../Hooks/TECoreApiHooks';
import { selectFormObjectRequest } from '../Redux/ObjectRequests/ObjectRequestsNew.selectors';
import { selectDesignForForm } from 'Redux/ActivityDesigner/activityDesigner.selectors';

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
  const objectRequests = useSelector(selectFormObjectRequest(formId));
  const selectSubmissions = useMemo(() => makeSelectSubmissions(), []);
  const submissions = useSelector((state) => selectSubmissions(state, formId));
  const activityDesign = useSelector(selectDesignForForm)(formId);
  const indexedFormInstances = useMemo(
    () => keyBy(submissions, '_id'),
    [submissions],
  );
  const selectActivitiesForForm = useMemo(
    () => makeSelectActivitiesForForm(),
    [],
  );
  const allActivities = useSelector((state) =>
    selectActivitiesForForm(state, formId),
  );

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
    const schedulingResults: {
      [formInstanceId: string]: ActivityValueValidation[];
    } = {};
    const groupedActivities = groupBy(
      activities,
      ({ formInstanceId }) => formInstanceId,
    );
    const queue = Object.keys(groupedActivities)
      .filter((formInstanceId) => formInstanceId)
      .map((formInstanceId: string) => {
        const activitiesOfFormInstance = groupedActivities[formInstanceId];
        return new Promise((resolve) => {
          scheduleActivities(
            activitiesOfFormInstance,
            formType,
            reservationMode,
            teCoreAPI[teCoreCallnames.REQUEST_SCHEDULE_ACTIVITIES],
            (schedulingReturns: ActivityValueValidation[]) => {
              schedulingResults[formInstanceId] = [
                ...(schedulingResults[formInstanceId] || []),
                ...(schedulingReturns || []),
              ];
              resolve(formInstanceId);
            },
            objectRequests,
            activityDesign,
          );
        });
      });

    return new Promise((resolve, reject) => {
      Promise.all(queue)
        // @ts-ignore
        .then((formInstanceIds: string[]) => {
          formInstanceIds.forEach((formInstanceId) => {
            if (!isEmpty(schedulingResults[formInstanceId])) {
              dispatch(
                updateActivities(
                  formId,
                  formInstanceId,
                  updateActivitiesWithSchedulingResults(
                    groupedActivities[formInstanceId],
                    schedulingResults[formInstanceId],
                  ),
                ),
              );
            }
          });

          const allResults = Object.keys(schedulingResults).reduce(
            (results: ActivityValueValidation[], formInstanceId: string) => {
              return [...results, ...(schedulingResults[formInstanceId] || [])];
            },
            [],
          );
          const hasValidActivity = flatten(allResults).some(
            (item: any) => !item.result.errorCode,
          );
          if (hasValidActivity) {
            openConfirmModal(checkActivitiesInFormInstance(groupedActivities));
          }
          resolve(schedulingResults);
        })
        .catch((err) => {
          console.log('ERROR', err);
          reject(err);
        });
    });
  };

  return {
    handleScheduleActivities,
  };
};
export default useActivityScheduling;
