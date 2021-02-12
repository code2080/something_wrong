import * as types from './te.actionTypes';

// INITIAL STATE
import { initialState } from './te.initialState';

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case types.SET_TE_DATA_FOR_VALUES: {
    const { extIdProps: { objects, fields, types } } = action.payload;
    return {
      ...state,
      extIdProps: {
        ...state.extIdProps,
        objects: {
          ...state.extIdProps.objects,
          ...objects
        },
        fields: {
          ...state.extIdProps.fields,
          ...fields
        },
        types: {
          ...state.extIdProps.types,
          ...types
        },
      }
    };
  }

  case types.SET_EXTID_PROPS_FOR_OBJECT: {
    const { extId, extIdProps } = action.payload;
    return {
      ...state,
      extIdProps: {
        ...state.extIdProps,
        objects: {
          ...state.extIdProps.objects,
          [extId]: {
            ...state.extIdProps.objects[extId],
            ...extIdProps,
          },
        },
      },
    };
  }

  default:
    return state;
  }
};

export default reducer;
