import { groupBy, keyBy } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { activityConvertFn, activityFilterFn } from 'Utils/activities.helpers';
import {
  scheduleActivities,
  scheduleActivitiesByFormInstanceId,
} from '../Utils/scheduling.helpers';
import chunk from 'lodash/chunk';
import { updateActivities } from '../Redux/Activities/activities.actions';
import { getActivities } from '../Utils/activities.helpers';

import { useTECoreAPI } from '../Hooks/TECoreApiHooks';
import { selectCoreUserId } from 'Redux/Auth/auth.selectors';
import { selectActivitiesForForm } from 'Redux/Activities/activities.selectors';
import { EActivityStatus } from '../Types/ActivityStatus.enum';

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

    scheduleActivities(validActivityIds, formId, coreUserId, dispatch);
  };

  const handleScheduleActivitiesByFormInstanceId = async (
    formInstanceId: string,
  ) => {
    scheduleActivitiesByFormInstanceId(
      formInstanceId,
      formId,
      coreUserId,
      dispatch,
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

  return {
    handleScheduleActivities,
    handleScheduleActivitiesByFormInstanceId,
    handleCancelReservations,
  };
};
export default useActivityScheduling;
