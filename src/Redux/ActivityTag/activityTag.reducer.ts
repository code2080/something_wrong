import * as types from './activityTag.actionTypes';
import {
  TActivityTag,
  TActivityTagMap,
  ActivityTag,
} from '../../Types/ActivityTag.type';

// INITIAL STATE
import initialState from './activityTag.initialState';

const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case types.FETCH_ACTIVITY_TAGS_SUCCESS: {
      const {
        results: activityTagObjs,
        actionMeta: { formId },
      } = action.payload;

      const activityTags: TActivityTagMap = activityTagObjs.reduce(
        (tot: any, acc: any) => {
          const activityTag: TActivityTag = ActivityTag.create(acc);
          return [...tot, activityTag];
        },
        [],
      );

      return {
        ...state,
        [formId]: activityTags || [],
      };
    }

    case types.CREATE_ACTIVITY_TAG_SUCCESS: {
      const { activityTag: activityTagObj } = action.payload;
      const activityTag: TActivityTag = ActivityTag.create(activityTagObj);
      return {
        ...state,
        [activityTag.formId]: [...state[activityTag.formId], activityTag],
      };
    }

    case types.UPDATE_ACTIVITY_TAG_SUCCESS: {
      const { activityTag: activityTagObj } = action.payload;
      const activityTag: TActivityTag = ActivityTag.create(activityTagObj);
      const aGIdx = state[activityTag.formId].findIndex(
        (aG: TActivityTag) => aG._id === activityTag._id,
      );

      return {
        ...state,
        [activityTag.formId]: [
          ...state[activityTag.formId].slice(0, aGIdx),
          activityTag,
          ...state[activityTag.formId].slice(aGIdx + 1),
        ],
      };
    }

    case types.DELETE_ACTIVITY_TAG_SUCCESS: {
      const {
        actionMeta: { activityTagId, formId },
      } = action.payload;
      const aGIdx = state[formId].findIndex(
        (aG: TActivityTag) => aG._id === activityTagId,
      );

      return {
        ...state,
        [formId]: [
          ...state[formId].slice(0, aGIdx),
          ...state[formId].slice(aGIdx + 1),
        ],
      };
    }

    default:
      return state;
  }
};

export default reducer;
