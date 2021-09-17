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

    default:
      return {
        ...state,
      };
  }
};
