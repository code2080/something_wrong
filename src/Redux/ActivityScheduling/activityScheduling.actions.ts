import { Key } from 'react';
import * as types from './activityScheduling.actionTypes';

export const startSchedulingActivities = (
  activityIds: Array<string | Key>,
) => ({
  type: types.START_SCHEDULING_ACTIVITIES,
  payload: { activityIds },
});

export const finishSchedulingActivities = (
  activityIds: Array<string | Key>,
) => ({
  type: types.FINISH_SCHEDULING_ACTIVITIES,
  payload: { activityIds },
});
