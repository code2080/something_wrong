import * as types from './constraints.actionTypes';

// MODELS
import Constraint from '../../Models/Constraint.model';
import { ConstraintConfiguration } from '../../Models/ConstraintConfiguration.model';

// INITIAL STATE
import initialState from './constraints.initialState';

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_CONSTRAINTS_SUCCESS: {
      if (!action || !action.payload) return state;
      const { constraints } = action.payload;
      return {
        ...constraints.reduce(
          (cons, el) => ({ ...cons, [el.constraintId]: new Constraint(el) }),
          {}
        )
      };
    }
    case types.FETCH_CONSTRAINT_CONFIGURATION_FOR_FORM_REQUEST: {
      if (!action || !action.payload) return state;
      const { constraintConfigurations } = action.payload;
      return {
        ...constraintConfigurations.reduce(
          (consConf, el) => ({
            ...consConf,
            [el.constraintConfigurationId]: new ConstraintConfiguration(el)
          }),
          {}
        )
      };
    }
    case types.CREATE_CONSTRAINT_CONFIGURATION_FOR_FORM_SUCCESS: {
      const {
        payload: { constraintConfiguration: _, ...constraintConfObj }
      } = action;
      const constraintConfiguration = new ConstraintConfiguration(
        constraintConfObj
      );
      const formConstraintConf = state[constraintConfiguration.formId] || {};
      return {
        ...state,
        [constraintConfiguration.formId]: {
          ...formConstraintConf,
          [constraintConfiguration.constraintConfigurationId]: {
            constraintConfiguration
          }
        }
      };
    }

    case types.UPDATE_CONSTRAINT_CONFIGURATION_FOR_FORM_SUCCESS: {
      const {
        payload: { constraintConfiguration: constraintConfObj }
      } = action;
      const constraintConfiguration = new ConstraintConfiguration(
        constraintConfObj
      );
      const formConstraintConf = state[constraintConfiguration.formId] || {};
      return {
        ...state,
        [constraintConfiguration.formId]: {
          ...formConstraintConf,
          [constraintConfiguration.constraintConfigurationId]: {
            constraintConfiguration
          }
        }
      };
    }

    case types.DELETE_CONSTRAINT_CONFIGURATION_FOR_FORM_SUCCESS: {
      const {
        payload: { formId, constraintConfigurationId }
      } = action;
      return {
        ...state,
        [formId]: Object.values(state[formId]).reduce(
          (results, constraintConf) => {
            if (
              constraintConf.constraintConfigurationId ===
              constraintConfigurationId
            ) {
              return {
                ...results
              };
            }
            return {
              ...results,
              [constraintConf]: constraintConf
            };
          },
          {}
        )
      };
    }

    default:
      return state;
  }
};

export default reducer;
