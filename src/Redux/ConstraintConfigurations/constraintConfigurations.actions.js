import { asyncAction } from '../../Utils/actionHelpers';
import * as types from './constraintConfigurations.actionTypes';
import { ConstraintConfiguration } from '../../Models/ConstraintConfiguration.model';
import { getEnvParams } from '../../configs';

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

export const createConstraintsConfigurations = ({
  formId,
  constraintConfigurationId,
  isActive,
  isHardConstraint,
  weight,
  parameters = [],
  operator,
  callback = null,
  meta = {},
}) => async (dispatch, getState) => {
  const storeState = await getState();
  const {
    auth: { coreUserId },
  } = storeState;
  const constraintConfiguration = new ConstraintConfiguration({
    constraintConfigurationId,
    isActive,
    isHardConstraint,
    weight,
    parameters,
    operator,
    userId: coreUserId,
  });

  dispatch(
    asyncAction.POST({
      flow: createConstraintsConfigurationsFlow,
      endpoint: `${getEnvParams().AM_BE_URL}forms/${formId}`,
      params: constraintConfiguration,
      postAction: { callback, meta },
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
  constraintConfigurationId,
  formId,
) => {
  asyncAction.DELETE({
    flow: deleteConstraintConfigurationFlow,
    endpoint: `${
      getEnvParams().AM_BE_URL
    }forms/${formId}/constraints/${constraintConfigurationId}`,
    params: {
      constraintConfigurationId,
      formId,
    },
  });
};
