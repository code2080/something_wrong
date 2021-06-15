import { createSelector } from 'reselect';
import { TConstraint } from '../../Types/Constraint.type';

const constraintState = (state: any) => state.constraints;

export const selectConstraints = createSelector(
  constraintState,
  (constraints: TConstraint[]) => constraints || [],
);
