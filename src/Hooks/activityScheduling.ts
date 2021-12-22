import { useMemo } from 'react';
import { Dictionary, groupBy, isEmpty, keyBy } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
// ACTIONS
import { selectDesignForForm } from 'Redux/ActivityDesigner/activityDesigner.selectors';
import { activityConvertFn, activityFilterFn } from 'Utils/activities.helpers';
import {
  scheduleActivities,
  updateActivitiesWithSchedulingResults,
} from '../Utils/scheduling.helpers';
import { updateActivities } from '../Redux/Activities/activities.actions';
import {
  startSchedulingActivities,
  finishSchedulingActivities,
} from 'Redux/ActivityScheduling/activityScheduling.actions';
import { getActivities } from '../Utils/activities.helpers';

// CONSTANTS
import { teCoreSchedulingProgress } from '../Constants/teCoreProps.constants';
import { teCoreCallnames } from '../Constants/teCoreActions.constants';

// COMPONENTS
import { makeSelectSubmissions } from '../Redux/FormSubmissions/formSubmissions.selectors';

// TYPES
import { makeSelectActivitiesForForm } from '../Redux/Activities/activities.selectors';
import { TActivity } from '../Types/Activity.type';
import { EActivityStatus } from '../Types/ActivityStatus.enum';
import { ActivityValueValidation } from '../Types/ActivityValueValidation.type';

// HOOKS
import { useMixpanel, useTECoreAPI } from '../Hooks/TECoreApiHooks';
import { selectFormObjectRequest } from '../Redux/ObjectRequests/ObjectRequestsNew.selectors';
import SchedulingStatusModal from './schedulingStatusConfirmModal';

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
  const mixpanel = useMixpanel();
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

  const trackScheduleActivities = (
    activities: string[] = [],
    formId: string,
  ) => {
    mixpanel?.track('scheduleActivities', {
      formId,
      nrOfActivities: activities.length,
    });
  };

  const checkActivitiesInFormInstance = (groupedActivities) => {
    return groupBy(Object.keys(groupedActivities), (submissionId) => {
      const unScheduleActivities = (allActivities[submissionId] || []).filter(
        (activity: TActivity) =>
          activity.activityStatus === EActivityStatus.NOT_SCHEDULED,
      );
      const submission = indexedFormInstances[submissionId];

      const activitiesInSubmission = groupedActivities[submissionId];
      switch (submission.teCoreProps.schedulingProgress) {
        // If NOT_SCHEDULED
        case teCoreSchedulingProgress.NOT_SCHEDULED: {
          if (unScheduleActivities.length === activitiesInSubmission.length)
            return teCoreSchedulingProgress.SCHEDULING_FINISHED;
          if (unScheduleActivities.length > activitiesInSubmission.length)
            return teCoreSchedulingProgress.IN_PROGRESS;
          return null;
        }

        case teCoreSchedulingProgress.IN_PROGRESS:
          if (unScheduleActivities.length === activitiesInSubmission.length)
            return teCoreSchedulingProgress.SCHEDULING_FINISHED;
          return null;

        case teCoreSchedulingProgress.SCHEDULING_FINISHED:
          return null;

        default:
          return null;
      }
    });
  };

  const handleScheduleActivities = async (selectedActivityIds: string[]) => {
    const activities = await getActivities({
      activityIds: selectedActivityIds,
    });
    const groupedActivities = groupBy(
      activities,
      ({ formInstanceId }) => formInstanceId,
    );

    trackScheduleActivities(selectedActivityIds, formId);
    const queue = Object.entries(groupedActivities).map(
      ([formInstanceId, activitiesOfFormInstance]) => {
        return new Promise<
          [formInstanceId: string, results: ActivityValueValidation[]]
        >((resolve) => {
          dispatch(
            startSchedulingActivities(
              activitiesOfFormInstance.map(({ _id }) => _id),
            ),
          );
          scheduleActivities(
            activitiesOfFormInstance,
            formType,
            reservationMode,
            teCoreAPI[teCoreCallnames.REQUEST_SCHEDULE_ACTIVITIES],
            (schedulingReturns: ActivityValueValidation[]) => {
              dispatch(
                finishSchedulingActivities(
                  activitiesOfFormInstance.map(({ _id }) => _id),
                ),
              );
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
              resolve([formInstanceId, schedulingReturns]);
            },
            objectRequests,
            activityDesign,
          );
        });
      },
    );

    return new Promise<Dictionary<ActivityValueValidation[]>>(
      (resolve, reject) => {
        Promise.all(queue)
          .then((schedulingResults) => {
            schedulingResults.forEach(([formInstanceId, results]) => {
              if (!isEmpty(results)) {
                dispatch(
                  updateActivities(
                    formId,
                    formInstanceId,
                    updateActivitiesWithSchedulingResults(
                      groupedActivities[formInstanceId],
                      results,
                    ),
                  ),
                );
              }
            });

            const hasValidActivity = schedulingResults
              .flatMap(([_, results]) => results)
              .some(({ result }) => !result?.errorCode);

            if (hasValidActivity) {
              openConfirmModal(
                checkActivitiesInFormInstance(groupedActivities),
              );
            }

            const mappedResults = schedulingResults.reduce<
              Dictionary<ActivityValueValidation[]>
            >(
              (acc, [formInstanceId, result]) => ({
                ...acc,
                [formInstanceId]: result,
              }),
              {},
            );

            resolve(mappedResults);
          })
          .catch((err) => {
            console.log('ERROR', err);
            reject(err);
          });
      },
    );
  };

  const handleDeleteActivities = async (activityIds: string[]) => {
    const activities = await getActivities({ activityIds });
    const groupedByFormInstance = groupBy(
      activities.filter(activityFilterFn.canBeSelected),
      'formInstanceId',
    );
    return Promise.all(
      Object.entries(groupedByFormInstance).map(
        ([formInstanceId, activities]) => {
          return teCoreAPI.deleteReservations({
            activities,
            callback: () =>
              dispatch(
                updateActivities(
                  formId,
                  formInstanceId,
                  activities.map(activityConvertFn.toDeleted),
                ),
              ),
          });
        },
      ),
    );
  };

  return {
    handleScheduleActivities,
    handleDeleteActivities,
  };
};
export default useActivityScheduling;
