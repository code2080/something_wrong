import {
  FETCH_CONSTRAINT_CONFIGURATIONS_FOR_FORM_SUCCESS,
  CREATE_CONSTRAINT_CONFIGURATION_FOR_FORM_SUCCESS,
  UPDATE_CONSTRAINT_CONFIGURATION_FOR_FORM_SUCCESS,
  DELETE_CONSTRAINT_CONFIGURATION_FOR_FORM_SUCCESS,
} from './constraintConfigurations.actionTypes';

// MODELS
import { ConstraintConfiguration } from '../../Types/ConstraintConfiguration.type';

const reducer = (state = {}, action) => {
  switch (action.type) {
    case FETCH_CONSTRAINT_CONFIGURATIONS_FOR_FORM_SUCCESS: {
      if (!action || !action.payload) return state;
      const { results } = action.payload;
      return results.reduce(
        (consConf, el) => ({
          ...consConf,
          [el.formId]: {
            ...consConf[el.formId],
            [el.constraintConfigurationId]: ConstraintConfiguration.create(el),
          },
        }),
        state
      );
    };

    case CREATE_CONSTRAINT_CONFIGURATION_FOR_FORM_SUCCESS:
    case UPDATE_CONSTRAINT_CONFIGURATION_FOR_FORM_SUCCESS: {
      const { payload: { constraintConfiguration: _, ...constraintConfObj } } = action;
      const constraintConfiguration = ConstraintConfiguration.create(constraintConfObj);
      return {
        ...state,
        [constraintConfiguration.formId]: {
          ...state[constraintConfiguration.formId],
          [constraintConfiguration._id]: constraintConfiguration,
        }
      };
    };

    case DELETE_CONSTRAINT_CONFIGURATION_FOR_FORM_SUCCESS: {
      const { payload: { formId, constraintConfigurationId } } = action;
      const { [constraintConfigurationId]: _, ...updFormState } = state[formId];
      return {
        ...state,
        [formId]: updFormState,
      };
    };

    default:
      return state;
  }
};

export default reducer;
