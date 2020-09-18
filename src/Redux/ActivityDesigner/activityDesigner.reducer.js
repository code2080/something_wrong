import _ from 'lodash';
import * as types from './activityDesigner.actionTypes';
import { ActivityDesignerMapping } from '../../Models/ActivityDesignerMapping.model';

// INITIAL STATE
import initialState from './activityDesigner.initialState';

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_MAPPINGS_FOR_FORM_SUCCESS: {
      const _mapping = _.get(action.payload.mappings, '0', {});
      const mapping = new ActivityDesignerMapping(_mapping);
      return {
        ...state,
        [action.payload.actionMeta.formId]: { ...mapping },
      };
    }

    case types.UPDATE_MAPPING_FOR_FORM_SUCCESS: {
      const { payload: { actionMeta: _, ...mapping } } = action;
      return {
        ...state,
        [mapping.formId]: {
          ...mapping,
        },
      };
    }

    default:
      return state;
  }
}

export default reducer;
