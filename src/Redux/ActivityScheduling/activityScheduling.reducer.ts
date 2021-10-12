import * as types from './activityScheduling.actionTypes';

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
    case types.START_SCHEDULING_ACTIVITIES: {
      const { activityIds } = action.payload;
      return {
        ...state,
        scheduling: {
          ...state.scheduling,
          ...activityIds.reduce((results, activityId) => {
            return {
              ...results,
              [activityId]: true,
            };
          }, {}),
        },
      };
    }

    case types.FINISH_SCHEDULING_ACTIVITIES: {
      const { activityIds } = action.payload;
      return {
        ...state,
        scheduling: {
          ...state.scheduling,
          ...activityIds.reduce((results, activityId) => {
            return {
              ...results,
              [activityId]: false,
            };
          }, {}),
        }
      }
    }

    default:
      return state;
  }
};
