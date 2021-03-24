import { asyncAction } from '../../Utils/actionHelpers';
import * as types from './constraintConfigurations.actionTypes';
import { ConstraintConfiguration } from '../../Models/ConstraintConfiguration.model';
import { getEnvParams } from '../../configs';

const opts = {
  // Make Mongoose use Unix time (seconds since Jan 1, 1970)
  timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
};

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

export const createConstraintConfigurations = (
  constrConf,
  callback = null,
) => async (dispatch, getState) => {
  const storeState = await getState();
  const {
    auth: { coreUserId },
  } = storeState;
  const { formId, description, constraints } = constrConf;
  const constraintConfiguration = new ConstraintConfiguration({
    name: 'New constraint configuration',
    formId,
    description: description || ' ',
    constraints,
    userId: coreUserId,
    constraintConfigurationId: ' ',
  });
  dispatch(
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

export const updateConstraintConfiguration = (consConf) => async (
  dispatch,
  getState,
) => {
  const storeState = await getState();
  const { name, description, _id, formId, constraints } = consConf;
  const constraintConfigurationId = _id;
  const {
    auth: { coreUserId },
  } = storeState;
  const constraintConfiguration = new ConstraintConfiguration({
    constraintConfigurationId,
    name,
    formId,
    constraints,
    description,
    timestamps: opts.timestamps,
    userId: coreUserId,
  });
  constraintConfiguration.constraintConfigurationId = _id;
  dispatch(
    asyncAction.PATCH({
      flow: updateConstraintConfigurationFlow,
      endpoint: `${
        getEnvParams().AM_BE_URL
      }forms/${formId}/constraint-configurations/${constraintConfigurationId}`,
      params: {
        constraintConfigurationId,
        formId,
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

export const deleteConstraintConfiguration = (
  constraintConfiguration,
) => async (dispatch) => {
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
