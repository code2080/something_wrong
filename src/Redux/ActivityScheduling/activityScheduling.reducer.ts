import { TActivity } from 'Types/Activity.type';
import * as activityTypes from '../Activities/activities.actionTypes';

export interface ActivitySchedulingState {
  scheduling: {
    [activityId: string]: boolean;
  };
}
export const initialState: ActivitySchedulingState = {
  scheduling: {},
};

export default (state: ActivitySchedulingState = initialState, action) => {
  switch (action.type) {
    case activityTypes.UPDATE_ACTIVITIES_REQUEST: {
      const { activities } = action.payload;
      return {
        ...state,
        scheduling: {
          ...state.scheduling,
          ...activities.reduce(
            (results, activity: TActivity) => ({
              ...results,
              [activity._id]: true,
            }),
            {},
          ),
        },
      };
    }

    case activityTypes.UPDATE_ACTIVITIES_FAILURE:
    case activityTypes.UPDATE_ACTIVITIES_SUCCESS: {
      const { activities } = action.payload;

      return {
        ...state,
        scheduling: {
          ...state.scheduling,
          ...activities.reduce(
            (results, activity: TActivity) => ({
              ...results,
              [activity._id]: false,
            }),
            {},
          ),
        },
      };
    }

    default:
      return state;
  }
};
