import _ from 'lodash';
import { createSelector } from 'reselect';
import { TConstraintConfiguration } from '../../Types/ConstraintConfiguration.type';
import { ConstraintConfigurationState } from './constraintConfigurations.reducer';

const constraintConfigurationState = (
  state: any,
): ConstraintConfigurationState => state.constraintConfigurations || {};

export const makeSelectConstraintConfigurationsForForm = () =>
  createSelector(
    constraintConfigurationState,
    (_, formId: string) => formId,
    (constraintConfigs, formId) =>
      (constraintConfigs && constraintConfigs.configurations[formId]) || [],
  );

export const selectCurrentConstraintConfigurationForForm = createSelector(
  constraintConfigurationState,
  (_, formId: string) => formId,
  // TODO: replace with proper logic
  (constraintConfigs, formId): TConstraintConfiguration | null => {
    const formConfigs = constraintConfigs.configurations[formId] ?? null;
    return _.head(Object.values(formConfigs)) ?? null;
  },
);
export const selectSelectedConstraintConfiguration = (formId: string) =>
  createSelector(constraintConfigurationState, (constraintConfigs) => {
    const selectedId: string =
      constraintConfigs.formConfigs[formId]?.selectedConfiguration;
    if (!selectedId) return null;
    return constraintConfigs.configurations[formId]?.[selectedId] ?? null;
  });

export const selectConstraintConfigurationById = (
  formId: string,
  constraintId: string,
) =>
  createSelector(
    constraintConfigurationState,
    (constraintConfigs) =>
      constraintConfigs.configurations[formId]?.[constraintId],
  );
