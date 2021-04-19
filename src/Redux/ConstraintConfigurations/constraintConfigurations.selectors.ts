import _ from 'lodash';
import { createSelector } from 'reselect';
import { TConstraintConfiguration } from '../../Types/ConstraintConfiguration.type';

const constraintConfigurationState = (
  state: any,
): { [formId: string]: { [constrConfId: string]: TConstraintConfiguration } } =>
  state.constraintConfigurations || {};

export const makeSelectConstraintConfigurationsForForm = () =>
  createSelector(
    constraintConfigurationState,
    (_, formId: string) => formId,
    (constraintConfigs, formId) =>
      (constraintConfigs && constraintConfigs[formId]) || [],
  );

export const selectCurrentConstraintConfigurationForForm = createSelector(
  constraintConfigurationState,
  (_, formId: string) => formId,
  // TODO: replace with proper logic
  (constraintConfigs, formId): TConstraintConfiguration | null => {
    const formConfigs = constraintConfigs[formId] ?? null;
    return _.head(Object.values(formConfigs)) ?? null;
  },
);
