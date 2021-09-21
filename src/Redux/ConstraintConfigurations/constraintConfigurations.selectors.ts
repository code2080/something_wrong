import { createSelector } from 'reselect';
import {
  ConstraintConfiguration,
  TConstraintConfiguration,
} from '../../Types/ConstraintConfiguration.type';
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

export const selectSelectedConstraintConfiguration = createSelector(
  constraintConfigurationState,
  (_, formId: string) => formId,
  (constraintConfigs, formId): ConstraintConfiguration | null => {
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
