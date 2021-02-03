import * as types from './activities.actionTypes';
import { Activity } from '../../Models/Activity.model';

// INITIAL STATE
import initialState from './activities.initialState';

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.REORDER_ACTIVITIES_REQUEST: {
      // Optimistic reordering before BE returns
      const { formId, formInstanceId, sourceIdx, destinationIdx } = action.payload;
      if (sourceIdx === destinationIdx) return state;
      const activities = state[formId][formInstanceId];
      /**
       * Reordering logic:
       * 1. Set moved activity sequenceIdx = destinationIdx
       * 2. If destinationIdx > sourceIdx => sequenceIdx -= 1 for all activities with sIdx > sourceIdx && <= destinationIdx
       * 3. If destinationIdx < sourceIdx => sequenceIdx += 1 for all activities with sIdx < sourceIdx && >= destinationIdx
       */
      const direction = destinationIdx - sourceIdx;
      const updActivities = activities.map(activity => {
        // If it's the moved activity
        if (activity.sequenceIdx === sourceIdx)
          return { ...activity, sequenceIdx: destinationIdx };
        // If activity should be moving DOWN
        if (direction > 0 && activity.sequenceIdx > sourceIdx && activity.sequenceIdx <= destinationIdx)
          return { ...activity, sequenceIdx: activity.sequenceIdx - 1 };
        // If activity should be moving UP
        if (direction < 0 && activity.sequenceIdx < sourceIdx && activity.sequenceIdx >= destinationIdx)
          return { ...activity, sequenceIdx: activity.sequenceIdx + 1 };
        // If activity is unaffected by the move
        return activity;
      });
      return {
        ...state,
        [formId]: {
          ...state[formId],
          [formInstanceId]: updActivities,
        }
      }
    }

    case types.REORDER_ACTIVITIES_SUCCESS: {
      const { payload: { actionMeta: { formId } } } = action;
      const activitityObjs = action.payload.activities || [];
      const hasSequenceIdx = activitityObjs.every(a => a.sequenceIdx != null);
      console.log('Fetched activities have sequenceIdx: ' + hasSequenceIdx);
      const activities = activitityObjs
        .map((el, idx) => new Activity({ ...el, sequenceIdx: el.sequenceIdx ? el.sequenceIdx : idx }))
        .reduce(
          (_activities, activity) => ({
            ..._activities,
            [activity.formInstanceId]: [
              ...(_activities[activity.formInstanceId] || []),
              activity
            ]
          }),
          {}
        );
      return {
        ...state,
        [formId]: activities,
      };
    }

    case types.FETCH_ACTIVITIES_FOR_FORM_SUCCESS:
    case types.UPDATE_ACTIVITIES_SUCCESS: {
      const { payload: { actionMeta: { formId } } } = action;
      const activitityObjs = action.payload.activities || [];
      const hasSequenceIdx = activitityObjs.every(a => a.sequenceIdx != null);
      console.log('Fetched activities have sequenceIdx: ' + hasSequenceIdx);
      const activities = activitityObjs
        .map((el, idx) => new Activity({ ...el, sequenceIdx: el.sequenceIdx ? el.sequenceIdx : idx }))
        .reduce(
          (_activities, activity) => ({
            ..._activities,
            [activity.formInstanceId]: [
              ...(_activities[activity.formInstanceId] || []),
              activity
            ]
          }),
          {}
        );
      return {
        ...state,
        [formId]: activities,
      };
    }

    case types.FETCH_ACTIVITIES_FOR_FORM_INSTANCE_SUCCESS: {
      const activitityObjs = action.payload.activities || [];
      const hasSequenceIdx = activitityObjs.every(a => a.sequenceIdx != null);
      console.log('Fetched activities have sequenceIdx: ' + hasSequenceIdx);
      const activities = activitityObjs
        .map((el, idx) => new Activity({ ...el, sequenceIdx: el.sequenceIdx ? el.sequenceIdx : idx }));
      const { payload: { actionMeta: { formId, formInstanceId } } } = action;
      return {
        ...state,
        [formId]: {
          ...state[formId],
          [formInstanceId]: [ ...activities ],
        }
      };
    }

    case types.SAVE_ACTIVITIES_FOR_FORM_INSTANCE_SUCCESS: {
      const activitityObjs = action.payload.activities || [];
      const hasSequenceIdx = activitityObjs.every(a => a.sequenceIdx != null);
      console.log('Fetched activities have sequenceIdx: ' + hasSequenceIdx);
      const activities = activitityObjs
        .map((el, idx) => new Activity({ ...el, sequenceIdx: el.sequenceIdx || idx }));
      const { payload: { actionMeta: { formId, formInstanceId } } } = action;
      return {
        ...state,
        [formId]: {
          ...state[formId],
          [formInstanceId]: [ ...activities ],
        }
      };
    }

    case types.MANUALLY_OVERRIDE_ACTIVITY_VALUE_SUCCESS:
    case types.REVERT_TO_SUBMISSION_VALUE_SUCCESS:
    case types.UPDATE_ACTIVITY_SUCCESS: {
      const { formId, formInstanceId, _id } = action.payload.activity;
      if (!formId || !formInstanceId)
        return state;
      const activityIdx = state[formId][formInstanceId].findIndex(el => el._id === _id);
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
      const { payload: { actionMeta: { formId } } } = action;
      return {
        ...state,
        [formId]: {},
      };
    }

    case types.DELETE_ACTIVITIES_FOR_FORM_INSTANCE_SUCCESS: {
      const { payload: { actionMeta: { formId, formInstanceId } } } = action;
      return {
        ...state,
        [formId]: Object.values(state[formId]).reduce((results, activity) => {
          if (activity.formInstanceId === formInstanceId) {
            return {
              ...results,
            };
          }
          return {
            ...results,
            [activity]: activity,
          };
        }, {})
      }
    }

    default:
      return state;
  }
}

export default reducer;
