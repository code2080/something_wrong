import { groupBy } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { activityConvertFn, activityFilterFn } from 'Utils/activities.helpers';
import { scheduleActivities } from '../Utils/scheduling.helpers';
import chunk from 'lodash/chunk';
import { updateActivities } from '../Redux/Activities/activities.actions';
import { getActivities } from '../Utils/activities.helpers';

import { useTECoreAPI } from '../Hooks/TECoreApiHooks';
import { selectCoreUserId } from 'Redux/Auth/auth.selectors';

type Props = {
  formType: string;
  formId: string;
  reservationMode: string;
};
const useActivityScheduling = ({ formId }: Props) => {
  const dispatch = useDispatch();
  const teCoreAPI = useTECoreAPI();

  const coreUserId = useSelector(selectCoreUserId);

  const handleScheduleActivities = async (selectedActivityIds: string[]) => {
    scheduleActivities(selectedActivityIds, coreUserId, dispatch);
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
