import _ from 'lodash';
import * as types from './activityDesigner.actionTypes';
import { ActivityDesign } from '../../Models/ActivityDesign.model';

// INITIAL STATE
import initialState from './activityDesigner.initialState';

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_MAPPINGS_FOR_FORM_SUCCESS: {
      const _mapping = _.get(action.payload.activityDesigns, '0', {});
      const mapping = new ActivityDesign(_mapping);
      return {
        ...state,
        [action.payload.actionMeta.formId]: { ...mapping },
      };
    }

    case types.UPDATE_MAPPING_FOR_FORM_SUCCESS: {
      const {
        payload: { design },
      } = action;
      return {
        ...state,
        [design.formId]: {
          ...design,
        },
      };
    }

    default:
      return state;
  }
};

export default reducer;
