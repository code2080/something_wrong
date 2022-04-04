import { createSelector } from 'reselect';
import { TConstraint } from '../../Types/Constraint.type';

const constraintState = (state: any) => state.constraints;

export const selectConstraints = createSelector(
  constraintState,
  (constraints: TConstraint[]) => constraints || [],
);

export const constraintSelector = (id: string) => (state: any) => {
  const constraint = state.constraints.find((el: any) => el.constraintId === id);
  return constraint || undefined;
};
