import _ from 'lodash';
import * as types from './manualSchedulings.actionTypes';

// INITIAL STATE
import initialState from './manualSchedulings.initialState';

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_FORM_INSTANCE_MANUAL_SCHEDULINGS_SUCCESS: {
      const rawArr = _.get(action, 'payload.manualSchedulings', []);
      const updState = rawArr.reduce(
        (prev, curr) => ({
          ...prev,
          [curr.formInstanceId]: {
            ...(prev[curr.formInstanceId] || {}),
            [curr.sectionId]: {
              ...(prev[curr.formInstanceId] &&
              prev[curr.formInstanceId][curr.sectionId]
                ? prev[curr.formInstanceId][curr.sectionId]
                : {}),
              [curr.rowKey]: curr.status,
            },
          },
        }),
        { ...state },
      );
      return updState;
    }

    case types.TOGGLE_ROW_SCHEDULING_STATUS_SUCCESS: {
      const { manualScheduling } = action.payload;
      if (!manualScheduling || !manualScheduling.formInstanceId) return state;
      const { formInstanceId, sectionId, rowKey, status } = manualScheduling;

      return {
        ...state,
        [formInstanceId]: {
          ...(state[formInstanceId] || {}),
          [sectionId]: {
            ...(state[formInstanceId] && state[formInstanceId][sectionId]
              ? state[formInstanceId][sectionId]
              : {}),
            [rowKey]: status,
          },
        },
      };
    }

    default:
      return state;
  }
};

export default reducer;
