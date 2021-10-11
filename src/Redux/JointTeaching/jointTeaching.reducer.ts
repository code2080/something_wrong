import JointTeachingGroup from 'Models/JointTeachingGroup.model';
import { initialState } from './jointTeaching.initialState';
import * as types from './jointTeaching.actionTypes';

export default (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_JOINT_TEACHING_GROUPS_FOR_FORM_SUCCESS: {
      const { jointTeaching, formId } = action.payload;
      return {
        ...state,
        groups: {
          [formId]: jointTeaching.map((jT) => new JointTeachingGroup(jT)),
        },
      };
    }

    case types.ADD_JOINT_TEACHING_CONFLICT_SUCCESS:
    case types.UPDATE_JOINT_TEACHING_CONFLICT_SUCCESS:
    case types.REMOVE_JOINT_TEACHING_CONFLICT_SUCCESS: {
      const {
        formId,
        jointTeaching: { conflicts, _id },
      } = action.payload;
      const foundIdx = state.groups[formId].findIndex((jT) => jT._id === _id);
      if (foundIdx === -1) return state;
      return {
        ...state,
        groups: {
          [formId]: [
            ...state.groups[formId].slice(0, foundIdx),
            state.groups[formId][foundIdx].reload({
              conflicts,
            }),
            ...state.groups[formId].slice(foundIdx + 1),
          ],
        },
      };
    }

    default:
      return {
        ...state,
      };
  }
};
