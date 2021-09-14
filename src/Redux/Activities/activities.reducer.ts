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

const reducer = (
  state: {
    [formId: string]: { [formInstanceId: string]: TActivity[] };
  } = initialState,
  action,
) => {
  switch (action.type) {
    case ASSIGN_ACTIVITIES_TO_TAG_SUCCESS:
    case types.SET_SCHEDULING_STATUS_OF_ACTIVITIES_SUCCESS: {
      const { activities: activityObjs } = action.payload;
      const activities = activityObjs.map((el) => new Activity(el));

      const updState = activities.reduce((s, a) => {
        const activityIdx = state[a.formId][a.formInstanceId].findIndex(
          (el) => el._id === a._id,
        );
        return {
          ...s,
          [a.formId]: {
            ...s[a.formId],
            [a.formInstanceId]: [
              ...s[a.formId][a.formInstanceId].slice(0, activityIdx),
              a,
              ...state[a.formId][a.formInstanceId].slice(activityIdx + 1),
            ],
          },
        };
      }, state);
      return updState;
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
          activities: activityObjs,
          actionMeta: { formId, sections },
        },
      } = action;

      const activities = updateActivitiesForForm(activityObjs, sections);

      return {
        ...state,
        [formId]: {
          ...activities,
        },
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
        payload: { design, activities },
      } = action as {
        payload: {
          design: any;
          activities: { [formInstanceId: string]: TActivity[] };
        };
      };
      const activityFormState = (Object.entries(activities) || []).reduce<{
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

    default:
      return state;
  }
};

export default reducer;
