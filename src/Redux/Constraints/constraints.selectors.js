import { createSelector } from 'reselect';

const constraintState = (state) => state.constraints;

export const selectConstraints =
  createSelector(
    constraintState,
    constraints => constraints || []
  );
