import * as types from './formSubmissions.actionTypes';

// INITIAL STATE
import initialState from './formSubmissions.initialState';

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_SUBMISSIONS_FOR_FORM_SUCCESS: {
      if (
        !action ||
        !action.payload ||
        !action.payload.submissions ||
        !action.payload.submissions.length
      )
        return state;
      const { submissions, form: { _id: formId } } = action.payload;
      return {
        ...state,
        [formId]: {
          ...submissions.reduce((f, el) => ({ ...f, [el._id]: { ...el, submitter: `${el.firstName} ${el.lastName}` } }), {}),
        }
      };
    };

    default:
      return state;
  }
}

export default reducer;
