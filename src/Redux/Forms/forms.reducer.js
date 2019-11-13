import * as types from './forms.actionTypes';

// INITIAL STATE
import initialState from './forms.initialState';

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_FORMS_SUCCESS: {
      if (!action || !action.payload || !action.payload.forms || !action.payload.forms.length) return state;
      const { forms } = action.payload;
      return {
        ...forms.reduce((f, el) => ({ ...f, [el._id]: el }), {}),
      };
    };

    default:
      return state;
  }
}

export default reducer;
