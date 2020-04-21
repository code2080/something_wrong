import * as types from './activities.actionTypes';
import { Activity } from '../../Models/Activity.model';

// INITIAL STATE
import initialState from './activities.initialState';

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_ACTIVITIES_FOR_FORM_SUCCESS: {
      const { payload: { actionMeta: { formId } } } = action;
      const activities = (action.payload.activities || [])
        .map(el => new Activity(el))
        .reduce(
          (_reservations, activity) => ({
            ..._reservations,
            [activity.formInstanceId]: [
              ...(_reservations[activity.formInstanceId] || []),
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
      const activities = (action.payload.activities || []).map(el => new Activity(el));
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
      const activities = (action.payload.activities || []).map(el => new Activity(el));
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
      const reservationIdx = state[formId][formInstanceId].findIndex(el => el._id === _id);
      if (reservationIdx === -1) return state;
      const activity = new Activity(action.payload.activity);
      return {
        ...state,
        [formId]: {
          ...state[formId],
          [formInstanceId]: [
            ...state[formId][formInstanceId].slice(0, reservationIdx),
            activity,
            ...state[formId][formInstanceId].slice(reservationIdx + 1),
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

    default:
      return state;
  }
}

export default reducer;
