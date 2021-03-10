import { createSelector } from 'reselect';
import { TConstraintConfiguration } from '../../Types/ConstraintConfiguration.type';

const constraintConfigurationState = (state: any) => state.constraintConfigurationState;

export const selectConstraintConfigurationsForForm = (formId: string) =>
  createSelector(
    constraintConfigurationState,
    ccState =>
      ccState && ccState[formId] ? ccState[formId] : [] as TConstraintConfiguration[]
  );
