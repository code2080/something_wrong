import { TConstraint, Constraint } from '../../Types/Constraint.type';
import { FETCH_CONSTRAINTS_SUCCESS } from './constraints.actionTypes';

// TYPES

const reducer = (state = [], action) => {
  switch (action.type) {
    case FETCH_CONSTRAINTS_SUCCESS: {
      if (!action || !action.payload) return state;
      const { results } = action.payload;
      return results.reduce(
        (cons: TConstraint[], el: any) => [...cons, Constraint.create(el)],
        [],
      );
    }

    default:
      return state;
  }
};

export default reducer;
