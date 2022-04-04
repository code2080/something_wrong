import { useDispatch, useSelector, useStore } from 'react-redux';
import { useParams } from 'react-router-dom';

// REDUX
import { selectSSPState } from 'Components/SSP/Utils/selectors';
import { batchOperationSchedule, batchOperationUnschedule } from 'Redux/Activities';
import { selectCoreUserId } from 'Redux/Auth/auth.selectors';
import { stopJob as reduxStopJob } from 'Redux/Jobs';

// TYPES
import {
  EActivityBatchOperation,
  TActivityBatchOperation,
} from 'Types/Activity/ActivityBatchOperations.type';
import { EActivityGroupings } from 'Types/Activity/ActivityGroupings.enum';
import { IState } from 'Types/State.type';

export const useScheduling = () => {
  const { formId } = useParams<{ formId: string }>();
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
      .flatMap((id) => activities.data[grouping].map[id]?.activityIds)
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

  const scheduleSelectedActivities = (
    selectedIds: string[],
    constraintProfileId: string,
    scheduleQuality: number,
  ) => {
    const activityIds = getActivityIds(selectedIds, groupBy);
    if (activityIds && activityIds.length && constraintProfileId && scheduleQuality) {
      const batchOperation: TActivityBatchOperation = {
        type: EActivityBatchOperation.SCHEDULE,
        data: activityIds,
        metadata: { constraintProfileId, scheduleQuality, scheduleAsUserId },
      };
      dispatch(batchOperationSchedule(formId, batchOperation));
    }
  };

  const unscheduleSelectedActivities = (selectedIds: string[]) => {
    const activityIds = getActivityIds(selectedIds, groupBy);
    if (!activityIds || !activityIds.length) return;
    const batchOperation: TActivityBatchOperation = {
      type: EActivityBatchOperation.UNSCHEDULE,
      data: activityIds,
    };
    dispatch(batchOperationUnschedule(formId, batchOperation));
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
