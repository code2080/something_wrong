import * as types from './mappings.actionTypes';
import { ReservationTemplateMapping } from '../../Models/Mapping.model';

// INITIAL STATE
import initialState from './mappings.initialState';

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_MAPPINGS_FOR_FORM_SUCCESS: {
      const mappings = (action.payload.mappings || []).reduce(
        (mappings, el) => ({ ...mappings, [el.reservationTemplateExtId]: new ReservationTemplateMapping(el), })
        ,
        {}
      );
      return {
        ...state,
        [action.payload.actionMeta.formId]: { ...mappings },
      };
    }

    case types.CREATE_MAPPING_FOR_FORM_SUCCESS: {
      const mapping = new ReservationTemplateMapping(action.payload);
      return {
        ...state,
        [action.payload.actionMeta.formId]: {
          ...state[action.payload.actionMeta.formId],
          [mapping.reservationTemplateExtId]: { ...mapping },
        },
      };
    }

    case types.UPDATE_MAPPING_FOR_FORM_SUCCESS: {
      const { payload: { actionMeta: _, ...mapping } } = action;
      return {
        ...state,
        [mapping.formId]: {
          ...state[mapping.formId],
          [mapping.reservationTemplateExtId]: { ...mapping },
        },
      };
    }

    default:
      return state;
  }
}

export default reducer;
