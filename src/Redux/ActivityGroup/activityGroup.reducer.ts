import * as types from './activityGroup.actionTypes';
import { TActivityGroup, TActivityGroupMap, ActivityGroup } from '../../Types/ActivityGroup.type';

// INITIAL STATE
import initialState from './activityGroup.initialState';

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_ACTIVITY_GROUPS_SUCCESS: {
      const { activityGroups: activityGroupObjs, actionMeta: { formId } } = action.payload;
      const activityGroups: TActivityGroupMap = activityGroupObjs.reduce((tot, acc) => {
        const activityGroup: TActivityGroup = ActivityGroup.create(acc);
        return {
          ...tot,
          [activityGroup._id]: activityGroup,
        };
      }, {});

      return {
        ...state,
        [formId]: activityGroups,
      };
    }

    default:
      return state;
  }
}

export default reducer;
