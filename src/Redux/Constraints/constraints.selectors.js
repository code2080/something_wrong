import { createSelector } from 'reselect';

const constraintState = (state) => state.constraints;

export const selectConstraints = (constraintId) =>
  createSelector(
    constraintState,
    (constraints) => constraints[constraintId] || []
  );
