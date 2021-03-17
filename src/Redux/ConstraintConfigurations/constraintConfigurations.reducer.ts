import {
  FETCH_CONSTRAINT_CONFIGURATIONS_FOR_FORM_SUCCESS,
  CREATE_CONSTRAINT_CONFIGURATION_FOR_FORM_SUCCESS,
  UPDATE_CONSTRAINT_CONFIGURATION_FOR_FORM_SUCCESS,
  DELETE_CONSTRAINT_CONFIGURATION_FOR_FORM_SUCCESS,
} from './constraintConfigurations.actionTypes';

// MODELS
import { ConstraintConfiguration, TConstraintConfiguration } from '../../Types/ConstraintConfiguration.type';

const reducer = (state = {}, action) => {
  switch (action.type) {
    case FETCH_CONSTRAINT_CONFIGURATIONS_FOR_FORM_SUCCESS: {
      if (!action?.payload) return state;
      const { actionMeta, ...payload } = action.payload;
      return Object.values(payload).reduce(
        (consConf: {[formId: string]: TConstraintConfiguration}, constraintConfig: any) => ({
          ...consConf,
          [constraintConfig.formId]: {
            ...consConf[constraintConfig.formId],
            [constraintConfig._id]: ConstraintConfiguration.create(constraintConfig),
          },
        }), state);
    };

    case CREATE_CONSTRAINT_CONFIGURATION_FOR_FORM_SUCCESS:
    case UPDATE_CONSTRAINT_CONFIGURATION_FOR_FORM_SUCCESS: {
      const { payload: { constraintConfiguration: _, ...constraintConfObj } } = action;
      const constraintConfiguration = ConstraintConfiguration.create(constraintConfObj);
      return {
        ...state,
        [constraintConfiguration.formId]: {
          ...state[constraintConfiguration.formId],
          [constraintConfiguration._id as string]: constraintConfiguration,
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
