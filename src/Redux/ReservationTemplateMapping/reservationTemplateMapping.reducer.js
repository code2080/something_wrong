import _ from 'lodash';
import * as types from './reservationTemplateMapping.actionTypes';
import { ReservationTemplateMapping } from '../../Models/ReservationTemplateMapping.model';

// INITIAL STATE
import initialState from './reservationTemplateMapping.initialState';

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_MAPPINGS_FOR_FORM_SUCCESS: {
      const _mapping = _.get(action.payload.mappings, '0', {});
      const mapping = new ReservationTemplateMapping(_mapping);
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
