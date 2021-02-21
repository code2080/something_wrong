import * as types from './activityGroup.actionTypes';
import { TActivityGroup, TActivityGroupMap, ActivityGroup } from '../../Types/ActivityGroup.type';

// INITIAL STATE
import initialState from './activityGroup.initialState';

const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case types.FETCH_ACTIVITY_GROUPS_SUCCESS: {
      const { results: activityGroupObjs, actionMeta: { formId } } = action.payload;
      
      const activityGroups: TActivityGroupMap = activityGroupObjs.reduce((tot: any, acc: any) => {
        const activityGroup: TActivityGroup = ActivityGroup.create(acc);
        return [
          ...tot,
          activityGroup,
        ];
      }, []);
      
      return {
        ...state,
        [formId]: activityGroups || [],
      };
    }

    case types.CREATE_ACTIVITY_GROUP_SUCCESS: {
      const { activityGroup: activityGroupObj } = action.payload;
      const activityGroup: TActivityGroup = ActivityGroup.create(activityGroupObj);
      return {
        ...state,
        [activityGroup.formId]: [
          ...state[activityGroup.formId],
          activityGroup,
        ],
      };
    };

    case types.UPDATE_ACTIVITY_GROUP_SUCCESS: {
      const { activityGroup: activityGroupObj } = action.payload;
      const activityGroup: TActivityGroup = ActivityGroup.create(activityGroupObj);
      const aGIdx = state[activityGroup.formId].findIndex((aG: TActivityGroup) => aG._id === activityGroup._id);

      return {
        ...state,
        [activityGroup.formId]: [
          ...state[activityGroup.formId].slice(0, aGIdx),
          activityGroup,
          ...state[activityGroup.formId].slice(aGIdx + 1),
        ],
      };
    };

    case types.DELETE_ACTIVITY_GROUP_SUCCESS: {
      const { actionMeta: { activityGroupId, formId } } = action.payload;
      const aGIdx = state[formId].findIndex((aG: TActivityGroup) => aG._id === activityGroupId);
  
      return {
        ...state,
        [formId]: [
          ...state[formId].slice(0, aGIdx),
          ...state[formId].slice(aGIdx + 1),
        ],
      };
    };

    default:
      return state;
  }
}

export default reducer;
