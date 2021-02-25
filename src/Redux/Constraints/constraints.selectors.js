import { createSelector } from 'reselect';

const constraintState = (state) => state.constraints;

export const selectConstraints = (constraintId) =>
  createSelector(
    constraintState,
    (constraints) => constraints[constraintId] || []
  );

const constraintConfigurationState = (state) =>
  state.constraintConfigurationState;
export const selectConstraintConfigurations = (constraintConfigurationId) =>
  createSelector(
    constraintConfigurationState,
    (constraintConfigurations) =>
      constraintConfigurations[constraintConfigurationId] || []
  );
