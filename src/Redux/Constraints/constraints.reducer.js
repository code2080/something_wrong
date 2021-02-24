import * as types from './constraints.actionTypes';

// MODELS
import Constraint from '../../Models/Constraint.model';
// INITIAL STATE
import initialState from './constraints.initialState';

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_CONSTRAINTS_SUCCESS: {
      if (!action || !action.payload) return state;
      const { constraints } = action.payload;
      return {
        ...constraints.reduce(
          (cons, el) => ({ ...cons, [el.constraintId]: new Constraint(el) }),
          {}
        )
      };
    }

    default:
      return state;
  }
};

export default reducer;
