import {
  FETCH_CONSTRAINT_CONFIGURATIONS_FOR_FORM_SUCCESS,
  CREATE_CONSTRAINT_CONFIGURATION_FOR_FORM_SUCCESS,
  UPDATE_CONSTRAINT_CONFIGURATION_FOR_FORM_SUCCESS,
  DELETE_CONSTRAINT_CONFIGURATION_FOR_FORM_SUCCESS,
  SELECT_CONSTRAINT_CONFIGURATION,
} from './constraintConfigurations.actionTypes';

// MODELS
import {
  ConstraintConfiguration,
  TConstraintConfiguration,
} from '../../Types/ConstraintConfiguration.type';

export interface ConstraintConfigurationState {
  configurations: any[];
  formConfigs: any;
}
const reducer = (
  state: ConstraintConfigurationState = { configurations: [], formConfigs: {} },
  action,
) => {
  switch (action.type) {
    case FETCH_CONSTRAINT_CONFIGURATIONS_FOR_FORM_SUCCESS: {
      if (!action?.payload) return state;
      const { actionMeta, ...payload } = action.payload;
      const configurations = Object.values(payload).reduce(
        (
          consConf: { [formId: string]: TConstraintConfiguration },
          constraintConfig: any,
        ) => ({
          ...consConf,
          [constraintConfig.formId]: {
            ...consConf[constraintConfig.formId],
            [constraintConfig._id]:
              ConstraintConfiguration.create(constraintConfig),
          },
        }),
        {},
      );
      return {
        ...state,
        configurations,

        formConfigs: Object.keys(configurations).reduce(
          (results, formId: string) => {
            return {
              ...state.formConfigs,
              [formId]: {
                ...results,
                selectedConfiguration: Object.keys(configurations[formId])[0],
              },
            };
          },
          {},
        ),
      };
    }
    // formConfigs: Object.keys(configurations)

    case CREATE_CONSTRAINT_CONFIGURATION_FOR_FORM_SUCCESS: {
      const {
        payload: { actionMeta: _, ...constrConfObj },
      } = action;
      const constraintConfiguration =
        ConstraintConfiguration.create(constrConfObj);
      Object.assign(constraintConfiguration, {
        constraintConfigurationId: constraintConfiguration._id,
      });
      return {
        ...state,
        configurations: {
          ...state.configurations,
          [constraintConfiguration.formId]: {
            ...state.configurations[constraintConfiguration.formId],
            [constraintConfiguration._id as string]: constraintConfiguration,
          },
        },
      };
    }

    case UPDATE_CONSTRAINT_CONFIGURATION_FOR_FORM_SUCCESS: {
      const {
        payload: { actionMeta: _, ...constraintConfObj },
      } = action;
      const constraintConfiguration =
        ConstraintConfiguration.create(constraintConfObj);
      constraintConfiguration._id = constraintConfObj.constraintConfigurationId;
      return {
        ...state,
        configurations: {
          ...state.configurations,
          [constraintConfiguration.formId]: {
            ...state.configurations[constraintConfiguration.formId],
            [constraintConfiguration._id as string]: constraintConfiguration,
          },
        },
      };
    }

    case DELETE_CONSTRAINT_CONFIGURATION_FOR_FORM_SUCCESS: {
      const {
        payload: {
          actionMeta: { formId, constraintConfigurationId },
        },
      } = action;
      const { [constraintConfigurationId]: _, ...updFormState } =
        state.configurations[formId] || {};
      return {
        ...state,
        configurations: {
          ...state.configurations,
          [formId]: updFormState,
        },
        formConfigs: {
          ...state.formConfigs,
          [formId]: {
            ...state.formConfigs[formId],
            selectedConfiguration: Object.keys(updFormState)[0],
          },
        },
      };
    }

    case SELECT_CONSTRAINT_CONFIGURATION: {
      const { formId, configurationId } = action.payload;
      return {
        ...state,
        formConfigs: {
          ...state.formConfigs,
          [formId]: {
            ...state.formConfigs[formId],
            selectedConfiguration: configurationId,
          },
        },
      };
    }

    default:
      return state;
  }
};

export default reducer;
