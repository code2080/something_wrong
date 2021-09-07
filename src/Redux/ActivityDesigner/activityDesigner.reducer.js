import _ from 'lodash';
import { SECTION_CONNECTED } from 'Constants/sectionTypes.constants';
import { ActivityDesign } from '../../Models/ActivityDesign.model';
import { determineSectionType } from '../../Utils/determineSectionType.helpers';
import * as types from './activityDesigner.actionTypes';

// INITIAL STATE
import initialState from './activityDesigner.initialState';

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_MAPPINGS_FOR_FORM_SUCCESS: {
      const _mapping = _.get(action.payload.activityDesigns, '0', {
        isEditable: true,
      });
      // Only support 1 recurring section in form.
      const calendarSection = action.payload.form.sections.find(
        (section) => determineSectionType(section) === SECTION_CONNECTED,
      );
      const mapping = new ActivityDesign({
        ..._mapping,
        hasTiming: !!calendarSection,
        useTimeslots: calendarSection?.calendarSettings?.useTimeslots,
      });
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

    case types.UNLOCK_ACTIVITY_DESIGN: {
      const {
        payload: { formId },
      } = action;
      return {
        ...state,
        [formId]: {
          ...state[formId],
          isEditable: true,
        },
      };
    }

    default:
      return state;
  }
};

export default reducer;
