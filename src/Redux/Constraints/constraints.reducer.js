import * as types from './constraints.actionTypes';

// MODELS
// import constraint from '../../Models/Constraint.model';

// INITIAL STATE
import initialState from './constraints.initialState';

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_CONSTRAINTS_SUCCESS: {
      if (!action) return state;
      return {
        ...state,
        [action.payload.constraint.constraintId]: {
          ...state[action.payload.constraint.constraintId],
          ...action.payload.constraint
        }
      };
    }

    default:
      return state;
  }
};

export default reducer;
