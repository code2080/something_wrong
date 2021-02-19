import _ from 'lodash';
import * as types from './elements.actionTypes';

const elementsReducer = (state = { map: {} }, action) => {
  switch (action.type) {
    case types.FETCH_ELEMENTS_SUCCESS:
      return {
        ...state,
        map: _.keyBy(action.payload.elements.elements, '_id'),
      };

    default:
      return state;
  }
};
export default elementsReducer;
