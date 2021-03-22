import { createSelector } from 'reselect';
import { TConstraintConfiguration } from '../../Types/ConstraintConfiguration.type';

const constraintConfigurationState = (state: any) =>
  state.constraintConfigurations || {};

export const selectConstraintConfigurationsForForm = (formId: string) =>
  createSelector(
    constraintConfigurationState,
    (constraintConfigs): TConstraintConfiguration[] =>
      (constraintConfigs && constraintConfigs[formId]) || [],
  );
