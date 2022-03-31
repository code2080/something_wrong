import { useDispatch, useSelector, useStore } from 'react-redux';
import { useParams } from 'react-router-dom';

// REDUX
import { selectSSPState } from 'Components/SSP/Utils/selectors';
import { batchOperationSchedule, batchOperationStatus } from 'Redux/Activities';
import { selectCoreUserId } from 'Redux/Auth/auth.selectors';
import { stopJob as reduxStopJob } from 'Redux/Jobs';
// HOOKS
import { useTECoreAPI } from './TECoreApiHooks';

// TYPES
import { TActivity } from 'Types/Activity/Activity.type';
import {
  EActivityBatchOperation,
  TActivityBatchOperation,
} from 'Types/Activity/ActivityBatchOperations.type';
import { EActivityGroupings } from 'Types/Activity/ActivityGroupings.enum';
import { EActivityStatus } from 'Types/Activity/ActivityStatus.enum';
import { IState } from 'Types/State.type';

export const useScheduling = () => {
  const { formId } = useParams<{ formId: string }>();
  const teCoreAPI = useTECoreAPI();
  const dispatch = useDispatch();
  const store = useStore(); // Hacky...

  /**
   * SELECTORS
   */
  const scheduleAsUserId = useSelector(selectCoreUserId);
  const { groupBy } = useSelector(selectSSPState('activities'));

  const getActivityIdsFromGrouping = (
    ids: string[],
    grouping: Exclude<EActivityGroupings, EActivityGroupings.FLAT>,
  ): string[] => {
    const activities = (store.getState() as IState).activities;
    return ids
      .flatMap((id) => activities.data[grouping].map[id].activityIds)
      .filter((id) => id);
  };

  const getActivityIds = (
    ids: string[],
    grouping: EActivityGroupings,
  ): string[] => {
    switch (grouping) {
      case EActivityGroupings.FLAT:
        return ids;
      case EActivityGroupings.WEEK_PATTERN:
      case EActivityGroupings.TAG:
        return getActivityIdsFromGrouping(ids, grouping);
    }
  };

  const getLoadedActivitiesFromActivityIds = (activityIds: string[]) => {
    const state = store.getState().activities;
    return activityIds
      .filter(
        (activityId) => state.data[EActivityGroupings.FLAT].map[activityId],
      )
      .map((activityId) => state.data[EActivityGroupings.FLAT].map[activityId]);
  };

  const scheduleSelectedActivities = (
    selectedIds: string[],
    constraintConfigurationId: string,
    scheduleQuality: number,
  ) => {
    const activityIds = getActivityIds(selectedIds, groupBy);

    const batchOperation: TActivityBatchOperation = {
      type: EActivityBatchOperation.SCHEDULE,
      data: activityIds,
      metadata: { constraintConfigurationId, scheduleQuality, scheduleAsUserId },
    };

    dispatch(batchOperationSchedule(formId, batchOperation));
  };

  const unscheduleSelectedActivities = (selectedIds: string[]) => {
    const activityIds = getActivityIds(selectedIds, groupBy);

    /**
     * NOTE: due to SSP limitations / TE Core API limitations
     * this only works with activities loaded into the SSP state
     */
    const loadedActivities = getLoadedActivitiesFromActivityIds(activityIds);
    const batchOperation: TActivityBatchOperation = {
      type: EActivityBatchOperation.STATUS,
      data: loadedActivities.map((a: TActivity) => ({
        _id: a._id,
        activityStatus: EActivityStatus.NOT_SCHEDULED,
      })),
    };
    return teCoreAPI.deleteReservations({
      activities: loadedActivities,
      callback: () => dispatch(batchOperationStatus(formId, batchOperation)),
    });
  };

  const stopJob = (jobId: string) => {
    dispatch(reduxStopJob(formId, jobId));
  };

  return {
    scheduleSelectedActivities,
    unscheduleSelectedActivities,
    stopJob,
  };
};
