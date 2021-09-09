import { TConstraintConfiguration } from 'Types/ConstraintConfiguration.type';
import { asyncAction } from '../../Utils/actionHelpers';
import { ConstraintConfiguration } from '../../Models/ConstraintConfiguration.model';
import { getEnvParams } from '../../configs';
import * as types from './constraintConfigurations.actionTypes';

const fetchConstraintsConfigurationsFlow = {
  request: () => ({
    type: types.FETCH_CONSTRAINT_CONFIGURATIONS_FOR_FORM_REQUEST,
  }),
  success: (response) => ({
    type: types.FETCH_CONSTRAINT_CONFIGURATIONS_FOR_FORM_SUCCESS,
    payload: { ...response },
  }),
  failure: (err) => ({
    type: types.FETCH_CONSTRAINT_CONFIGURATIONS_FOR_FORM_FAILURE,
    payload: { ...err },
  }),
};

export const fetchConstraintConfigurations = (formId) =>
  asyncAction.GET({
    flow: fetchConstraintsConfigurationsFlow,
    endpoint: `${
      getEnvParams().AM_BE_URL
    }forms/${formId}/constraint-configurations`,
  });

const createConstraintsConfigurationsFlow = {
  request: () => ({
    type: types.CREATE_CONSTRAINT_CONFIGURATION_FOR_FORM_REQUEST,
  }),
  success: (response) => ({
    type: types.CREATE_CONSTRAINT_CONFIGURATION_FOR_FORM_SUCCESS,
    payload: { ...response },
  }),
  failure: (err) => ({
    type: types.CREATE_CONSTRAINT_CONFIGURATION_FOR_FORM_FAILURE,
    payload: { ...err },
  }),
};

export const createConstraintConfigurations =
  (constrConf, callback = null) =>
  async (dispatch) => {
    const { formId, description, constraints } = constrConf;
    const constraintConfiguration = new ConstraintConfiguration({
      name: 'New constraint configuration',
      formId,
      description: description || ' ',
      constraints,
      constraintConfigurationId: ' ',
    });
    return dispatch(
      asyncAction.POST({
        flow: createConstraintsConfigurationsFlow,
        endpoint: `${
          getEnvParams().AM_BE_URL
        }forms/${formId}/constraint-configurations`,
        params: constraintConfiguration,
        postAction: { callback },
      }),
    );
  };

const updateConstraintConfigurationFlow = {
  request: () => ({
    type: types.UPDATE_CONSTRAINT_CONFIGURATION_FOR_FORM_REQUEST,
  }),
  success: (response) => ({
    type: types.UPDATE_CONSTRAINT_CONFIGURATION_FOR_FORM_SUCCESS,
    payload: { ...response },
  }),
  failure: (err) => ({
    type: types.UPDATE_CONSTRAINT_CONFIGURATION_FOR_FORM_FAILURE,
    payload: { ...err },
  }),
};

export const updateConstraintConfiguration =
  (constraintConfiguration: TConstraintConfiguration) => async (dispatch) => {
    const { _id, formId } = constraintConfiguration;
    dispatch(
      asyncAction.PATCH({
        flow: updateConstraintConfigurationFlow,
        endpoint: `${
          getEnvParams().AM_BE_URL
        }forms/${formId}/constraint-configurations/${_id}`,
        params: {
          formId,
          constraintConfigurationId: constraintConfiguration._id,
          constraintConfiguration,
        },
      }),
    );
  };

const deleteConstraintConfigurationFlow = {
  request: () => ({
    type: types.DELETE_CONSTRAINT_CONFIGURATION_FOR_FORM_REQUEST,
  }),
  success: (response) => ({
    type: types.DELETE_CONSTRAINT_CONFIGURATION_FOR_FORM_SUCCESS,
    payload: { ...response },
  }),
  failure: (err) => ({
    type: types.DELETE_CONSTRAINT_CONFIGURATION_FOR_FORM_FAILURE,
    payload: { ...err },
  }),
};

export const deleteConstraintConfiguration =
  (constraintConfiguration) => async (dispatch) => {
    const { _id, formId } = constraintConfiguration;
    const constraintConfigurationId = _id;
    dispatch(
      asyncAction.DELETE({
        flow: deleteConstraintConfigurationFlow,
        endpoint: `${
          getEnvParams().AM_BE_URL
        }forms/${formId}/constraint-configurations/${constraintConfigurationId}`,
        params: {
          constraintConfigurationId,
          formId,
        },
      }),
    );
  };

export const selectConstraintConfiguration = (formId, configurationId) => ({
  type: types.SELECT_CONSTRAINT_CONFIGURATION,
  payload: {
    formId,
    configurationId,
  },
});
