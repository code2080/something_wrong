import { groupBy, keyBy } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { activityConvertFn, activityFilterFn } from 'Utils/activities.helpers';
import {
  scheduleActivities,
  scheduleActivitiesByFormInstanceId,
} from '../Utils/scheduling.helpers';
import chunk from 'lodash/chunk';
import {
  updateActivities,
  resetActivitiesOnCancelReservationByFormInstanceId,
} from '../Redux/DEPR_Activities/activities.actions';
import {
  getActivities,
  getActivitiesByFormIdWithFilter,
  deleteReservationAsync,
  updatedMultipleActivity,
} from '../Utils/activities.helpers';

import { useTECoreAPI } from './TECoreApiHooks';
import { selectCoreUserId, selectIsBetaOrDev } from 'Redux/Auth/auth.selectors';
import { selectActivitiesForForm } from 'Redux/DEPR_Activities/activities.selectors';
import { EActivityStatus } from '../Types/Activity/ActivityStatus.enum';
import { CRITERIA_OPTIONS } from 'Constants/filterSetting.constants';

type Props = {
  formType: string;
  formId: string;
  reservationMode: string;
};
const useActivityScheduling = ({ formId }: Props) => {
  const dispatch = useDispatch();
  const teCoreAPI = useTECoreAPI();
  const coreUserId = useSelector(selectCoreUserId);
  const pulledActivities = useSelector(selectActivitiesForForm({ formId }));
  const isBeta = useSelector(selectIsBetaOrDev);

  const handleScheduleActivities = async (selectedActivityIds: string[]) => {
    const keyByActivities = keyBy(pulledActivities, '_id');
    // filtering out invalid activities by compare with the pulled activity to reduce the redundant activity in the FE
    const validActivityIds = selectedActivityIds.filter(
      (activityId) =>
        !keyByActivities[activityId] ||
        ![EActivityStatus.SCHEDULED, EActivityStatus.INACTIVE].includes(
          keyByActivities[activityId].activityStatus,
        ),
    );

    scheduleActivities(validActivityIds, formId, coreUserId, dispatch, isBeta);
  };

  const handleScheduleActivitiesByFormInstanceId = async (
    formInstanceId: string,
  ) => {
    scheduleActivitiesByFormInstanceId(
      formInstanceId,
      formId,
      coreUserId,
      dispatch,
      isBeta,
    );
  };

  const handleCancelReservations = async (activityIds: string[]) => {
    const chunkedIds = chunk(activityIds, 50);
    const activities = (
      await Promise.all(
        chunkedIds.flatMap((idChunk) =>
          getActivities({ activityIds: idChunk }),
        ),
      )
    ).flat();

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

  const handleCancelReservationsByFormInstanceId = async (
    formInstanceId: string,
  ) => {
    let flag = false;
    const limit = 50;
    // update activity status in redux store
    dispatch(
      resetActivitiesOnCancelReservationByFormInstanceId({
        formInstanceId,
        formId,
      }),
    );
    while (!flag) {
      // getting activity by formInstanceId
      const { activities } = await getActivitiesByFormIdWithFilter(formId, {
        filter: {
          matchCriteria: CRITERIA_OPTIONS.ALL,
          formInstanceId,
          activityStatus: EActivityStatus.SCHEDULED,
        },
        options: { pagination: { page: 1, limit } },
      });

      // exit the loop when there are no scheduled activities
      if (!activities || activities.length === 0) {
        flag = true;
        return;
      }

      // execute delete reservation in te-core
      const cancelledActivities = await deleteReservationAsync(
        activities,
        teCoreAPI,
      );

      await updatedMultipleActivity(cancelledActivities); // calling updating activity status API
    }
  };

  return {
    handleScheduleActivities,
    handleCancelReservations,
    handleScheduleActivitiesByFormInstanceId,
    handleCancelReservationsByFormInstanceId,
  };
};
export default useActivityScheduling;
