import _ from 'lodash';
import { TActivity } from 'Types/Activity.type';
import { Activity } from '../../Models/Activity.model';
import { ASSIGN_ACTIVITIES_TO_TAG_SUCCESS } from '../ActivityTag/activityTag.actionTypes';
import * as activityDesignerTypes from '../ActivityDesigner/activityDesigner.actionTypes';
import { ABORT_JOB_SUCCESS } from '../Jobs/jobs.actionTypes';
import * as types from './activities.actionTypes';

// INITIAL STATE
import initialState from './activities.initialState';
import { updateActivitiesForForm } from './activities.helpers';

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ASSIGN_ACTIVITIES_TO_TAG_SUCCESS:
    case types.SET_SCHEDULING_STATUS_OF_ACTIVITIES_SUCCESS: {
      const { activities: activityObjs } = action.payload;
      const activities = activityObjs.map(
        (activity) => new Activity(activity),
      ) as TActivity[];

      return activities.reduce((updatedState, activity) => {
        return {
          ...updatedState,
          [activity.formId]: {
            ...(updatedState[activity.formId] || {}),
            [activity.formInstanceId]: [
              ...(
                updatedState[activity.formId]?.[activity.formInstanceId] || []
              ).map((oldActivity) =>
                oldActivity._id === activity._id ? activity : oldActivity,
              ),
            ],
          },
        };
      }, state);
    }

    case types.REORDER_ACTIVITIES_REQUEST: {
      // Optimistic reordering before BE returns
      const { formId, formInstanceId, sourceIdx, destinationIdx } =
        action.payload;
      if (sourceIdx === destinationIdx) return state;
      const activities = state[formId][formInstanceId];
      /**
       * Reordering logic:
       * 1. Set moved activity sequenceIdx = destinationIdx
       * 2. If destinationIdx > sourceIdx => sequenceIdx -= 1 for all activities with sIdx > sourceIdx && <= destinationIdx
       * 3. If destinationIdx < sourceIdx => sequenceIdx += 1 for all activities with sIdx < sourceIdx && >= destinationIdx
       */
      const direction = destinationIdx - sourceIdx;
      const updActivities = activities.map((activity) => {
        if (!activity.sequenceIdx) {
          return activity;
        }
        // If it's the moved activity
        if (activity.sequenceIdx === sourceIdx)
          return { ...activity, sequenceIdx: destinationIdx };
        // If activity should be moving DOWN
        else if (
          direction > 0 &&
          activity.sequenceIdx > sourceIdx &&
          activity.sequenceIdx <= destinationIdx
        ) {
          return { ...activity, sequenceIdx: activity.sequenceIdx - 1 };
          // If activity should be moving UP
        } else if (
          direction < 0 &&
          activity.sequenceIdx < sourceIdx &&
          activity.sequenceIdx >= destinationIdx
        ) {
          return { ...activity, sequenceIdx: activity.sequenceIdx + 1 };
          // If activity is unaffected by the move
        } else {
          return activity;
        }
      });
      return {
        ...state,
        [formId]: {
          ...state[formId],
          [formInstanceId]: updActivities,
        },
      };
    }

    case types.FETCH_ACTIVITIES_FOR_FORM_SUCCESS: {
      const {
        payload: {
          activities,
          actionMeta: { formId, tableType, pagination },
          totalPage,
        },
      } = action;
      const formIdValue = tableType ? formId + tableType : formId;
      return {
        ...state,
        list: activities,
        filteredActivityIds: {
          ...(state.allActivitiyIds || {}),
          [formIdValue]: activities.map(({ _id }) => _id),
        },
        byFormId: {
          // [formIdValue]: Object.keys(allActivities),
        },
        byFormInstanceId: {
          // [formIdValue]: Object.values(
          //   allActivities as Dictionary<{
          //     formInstanceId: string;
          //     _id: string;
          //   }>,
          // ).reduce<Dictionary<string[]>>(
          //   (res, { _id, formInstanceId }) => ({
          //     ...res,
          //     [formInstanceId]: [...(res[formInstanceId] ?? []), _id],
          //   }),
          //   {},
          // ),
        },
        [formIdValue]: {
          ..._.groupBy(
            activities.map((activity) => new Activity(activity)),
            'formInstanceId',
          ),
        },
        paginationParams: {
          ...state.paginationParams,
          [formId]: {
            totalPages: totalPage,
            currentPage: pagination?.page,
            limit: pagination?.limit,
          },
        },
      };
    }

    case types.FETCH_ALL_ACTIVITIES_FOR_FORM_SUCCESS: {
      return {
        ...state,
        allActivities: action.payload.activities,
      };
    }

    case types.RESET_ALL_ACTIVITIES: {
      return {
        ...state,
        allActivities: null,
      };
    }

    case types.REORDER_ACTIVITIES_SUCCESS:
    case types.UPDATE_ACTIVITIES_SUCCESS:
    case ABORT_JOB_SUCCESS: {
      const {
        payload: {
          actionMeta: { formId },
        },
      } = action;
      const activitityObjs = action.payload.activities || [];
      const activities = updateActivitiesForForm(activitityObjs);
      return {
        ...state,
        [formId]: {
          ...state[formId],
          ...Object.keys(activities).reduce((results, formInstanceId) => {
            const oldActivities = _.get(state, [formId, formInstanceId], []);
            const oldActivityIds = oldActivities.map(({ _id }) => _id);
            const newActivities = _.filter(
              activities[formInstanceId],
              (item) => !oldActivityIds.includes(item._id),
            );

            return {
              ...results,
              // TO KEEP ACTIVITY INDEX
              [formInstanceId]: [
                ...oldActivities.map((activity) => {
                  const foundActivity = activities[formInstanceId].find(
                    (a) => a._id === activity._id,
                  );
                  if (foundActivity) return foundActivity;
                  return activity;
                }),
                ...newActivities,
              ],
            };
          }, {}),
        },
      };
    }

    case activityDesignerTypes.UPDATE_MAPPING_FOR_FORM_SUCCESS: {
      const {
        payload: { design, activities, isWorkProgress },
      } = action as {
        payload: {
          design: any;
          activities: { [formInstanceId: string]: TActivity[] };
          isWorkProgress?: boolean;
        };
      };

      if (isWorkProgress) {
        return {
          ...state,
          inWorkerProgress: {
            ...state.inWorkerProgress,
            [design.formId]: true,
          },
        };
      }

      const activityFormState = Object.entries(activities || {}).reduce<{
        [formInstanceId: string]: TActivity[];
      }>((fIState, [formInstanceId, activityObjs]) => {
        const as = activityObjs.map(
          (a, idx) =>
            new Activity({
              ...a,
              sequenceIdx: a.sequenceIdx ?? idx,
            }),
        );
        return {
          ...fIState,
          [formInstanceId]: as,
        };
      }, {});
      return {
        ...state,
        [design.formId]: activityFormState,
      };
    }

    case types.FETCH_ACTIVITIES_FOR_FORM_INSTANCE_SUCCESS: {
      const activitityObjs = action.payload.activities || [];
      const hasSequenceIdx = activitityObjs.every((a) => a.sequenceIdx != null);
      console.log('Fetched activities have sequenceIdx: ' + hasSequenceIdx);
      const activities = activitityObjs.map(
        (el, idx) =>
          new Activity({
            ...el,
            sequenceIdx: el.sequenceIdx ?? idx,
          }),
      );
      const {
        payload: {
          actionMeta: { formId, formInstanceId },
        },
      } = action;
      return {
        ...state,
        [formId]: {
          ...state[formId],
          [formInstanceId]: [...activities],
        },
      };
    }

    case types.SAVE_ACTIVITIES_FOR_FORM_INSTANCE_SUCCESS: {
      const activitityObjs = action.payload.activities || [];
      const activities = activitityObjs.map(
        (el, idx) =>
          new Activity({ ...el, sequenceIdx: el.sequenceIdx || idx }),
      );
      const {
        payload: {
          actionMeta: { formId, formInstanceId },
        },
      } = action;
      return {
        ...state,
        [formId]: {
          ...state[formId],
          [formInstanceId]: [...activities],
        },
      };
    }

    case types.MANUALLY_OVERRIDE_ACTIVITY_VALUE_SUCCESS:
    case types.REVERT_TO_SUBMISSION_VALUE_SUCCESS:
    case types.UPDATE_ACTIVITY_SUCCESS: {
      const { formId, formInstanceId, _id } = action.payload.activity;
      if (!formId || !formInstanceId) return state;
      const activityIdx = state[formId][formInstanceId].findIndex(
        (el) => el._id === _id,
      );
      if (activityIdx === -1) return state;
      const activity = new Activity(action.payload.activity);
      return {
        ...state,
        [formId]: {
          ...state[formId],
          [formInstanceId]: [
            ...state[formId][formInstanceId].slice(0, activityIdx),
            activity,
            ...state[formId][formInstanceId].slice(activityIdx + 1),
          ],
        },
      };
    }

    case types.DELETE_ACTIVITIES_FOR_FORM_SUCCESS: {
      const {
        payload: {
          actionMeta: { formId },
        },
      } = action;
      return {
        ...state,
        [formId]: {},
      };
    }

    case types.DELETE_ACTIVITIES_FOR_FORM_INSTANCE_SUCCESS: {
      const {
        payload: {
          actionMeta: { formId, formInstanceId },
        },
      } = action;
      return {
        ...state,
        [formId]: _.omit(state[formId], formInstanceId),
      };
    }

    case types.UPDATE_ACTIVITY_IN_WORKER_PROGRESS: {
      const {
        payload: { formId },
      } = action;

      return {
        ...state,
        inWorkerProgress: {
          ...state.inWorkerProgress,
          [formId]: undefined,
        },
      };
    }

    case types.GET_ACTIVITIES_IN_WORKER_PROGRESS_SUCCESS: {
      const {
        payload: { workerProgress, formId },
      } = action;

      if (!workerProgress) {
        return {
          ...state,
        };
      }

      return {
        ...state,
        inWorkerProgress: {
          ...state.inWorkerProgress,
          [formId]: workerProgress.status === 'PENDING' ? true : undefined,
        },
      };
    }

    default:
      return state;
  }
};

export default reducer;
