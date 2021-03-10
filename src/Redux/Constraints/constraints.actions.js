import { asyncAction } from '../../Utils/actionHelpers';
import * as types from './constraints.actionTypes';
import { ConstraintConfiguration } from '../../Models/ConstraintConfiguration.model';
import { getEnvParams } from '../../configs';

const fetchConstraintsFlow = {
  request: () => ({ type: types.FETCH_CONSTRAINTS_REQUEST }),
  success: (response) => ({
    type: types.FETCH_CONSTRAINTS_SUCCESS,
    payload: { ...response }
  }),
  failure: (err) => ({
    type: types.FETCH_CONSTRAINTS_FAILURE,
    payload: { ...err }
  })
};

export const fetchConstraints = () => {
  asyncAction.GET({
    flow: fetchConstraintsFlow,
    endpoint: `${getEnvParams().AM_BE_URL}constraints`,
    requiresAuth: true
  });
};

const fetchConstraintsConfigurationsFlow = {
  request: () => ({
    type: types.FETCH_CONSTRAINT_CONFIGURATION_FOR_FORM_REQUEST
  }),
  success: (response) => ({
    type: types.FETCH_CONSTRAINT_CONFIGURATION_FOR_FORM_SUCCESS,
    payload: { ...response }
  }),
  failure: (err) => ({
    type: types.FETCH_CONSTRAINT_CONFIGURATION_FOR_FORM_FAILURE,
    payload: { ...err }
  })
};

export const fetchConstraintConfigurations = (formId) =>
  asyncAction.GET({
    flow: fetchConstraintsConfigurationsFlow,
    endpoint: `${
      getEnvParams().AM_BE_URL
    }constraintConfigurations/forms/${formId}`
  });
const createConstraintsConfigurationsFlow = {
  request: () => ({
    type: types.CREATE_CONSTRAINT_CONFIGURATION_FOR_FORM_REQUEST
  }),
  success: (response) => ({
    type: types.CREATE_CONSTRAINT_CONFIGURATION_FOR_FORM_SUCCESS,
    payload: { ...response }
  }),
  failure: (err) => ({
    type: types.CREATE_CONSTRAINT_CONFIGURATION_FOR_FORM_FAILURE,
    payload: { ...err }
  })
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
  meta = {}
}) => async (dispatch, getState) => {
  const storeState = await getState();
  const {
    auth: { coreUserId }
  } = storeState;
  const constraintConfiguration = new ConstraintConfiguration({
    constraintConfigurationId,
    isActive,
    isHardConstraint,
    weight,
    parameters,
    operator,
    userId: coreUserId
  });

  dispatch(
    asyncAction.POST({
      flow: createConstraintsConfigurationsFlow,
      endpoint: `${getEnvParams().AM_BE_URL}forms/${formId}`,
      params: constraintConfiguration,
      postAction: { callback, meta }
    })
  );
};

const updateConstraintConfigurationFlow = {
  request: () => ({
    type: types.UPDATE_CONSTRAINT_CONFIGURATION_FOR_FORM_REQUEST
  }),
  success: (response) => ({
    type: types.UPDATE_CONSTRAINT_CONFIGURATION_FOR_FORM_SUCCESS,
    payload: { ...response }
  }),
  failure: (err) => ({
    type: types.UPDATE_CONSTRAINT_CONFIGURATION_FOR_FORM_FAILURE,
    payload: { ...err }
  })
};

export const updateConstraintConfiguration = (
  constraintConfigurationId,
  formId,
  constraintId,
  isActive,
  isHardConstraint,
  weight,
  parameters,
  operator
) => async (dispatch, getState) => {
  const storeState = await getState();
  const {
    auth: { coreUserId }
  } = storeState;
  const constraintConfiguration = new ConstraintConfiguration({
    constraintId,
    isActive,
    isHardConstraint,
    weight,
    parameters,
    operator,
    userId: coreUserId
  });
  asyncAction.PATCH({
    flow: updateConstraintConfigurationFlow,
    endpoint: `${
      getEnvParams().AM_BE_URL
    }forms/${formId}/constraints/${constraintConfigurationId}`,
    params: {
      constraintConfigurationId,
      formId,
      constraintConfiguration
    }
  });
};

const deleteConstraintConfigurationFlow = {
  request: () => ({
    type: types.DELETE_CONSTRAINT_CONFIGURATION_FOR_FORM_REQUEST
  }),
  success: (response) => ({
    type: types.DELETE_CONSTRAINT_CONFIGURATION_FOR_FORM_SUCCESS,
    payload: { ...response }
  }),
  failure: (err) => ({
    type: types.DELETE_CONSTRAINT_CONFIGURATION_FOR_FORM_FAILURE,
    payload: { ...err }
  })
};

export const deleteConstraintConfiguration = (
  constraintConfigurationId,
  formId
) => {
  asyncAction.DELETE({
    flow: deleteConstraintConfigurationFlow,
    endpoint: `${
      getEnvParams().AM_BE_URL
    }forms/${formId}/constraints/${constraintConfigurationId}`,
    params: {
      constraintConfigurationId,
      formId
    }
  });
};
