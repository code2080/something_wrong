import { createSelector } from 'reselect';
import { TConstraintConfiguration } from '../../Types/DEPR_ConstraintConfiguration.type';
import { ConstraintConfigurationState } from './DEPR_constraintConfigurations.reducer';

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

export const selectSelectedConstraintConfiguration = createSelector(
  [constraintConfigurationState, (_, formId: string) => formId],
  (constraintConfigs, formId): TConstraintConfiguration | null => {
    const selectedId: string =
      constraintConfigs.formConfigs[formId]?.selectedConfiguration;
    if (!selectedId) return null;
    return constraintConfigs.configurations[formId]?.[selectedId] ?? null;
  },
);

export const selectConstraintConfigurationById = (
  formId: string,
  constraintId: string,
) =>
  createSelector(
    constraintConfigurationState,
    (constraintConfigs): TConstraintConfiguration =>
      constraintConfigs.configurations[formId]?.[constraintId],
  );
