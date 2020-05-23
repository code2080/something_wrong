import _ from 'lodash';
import * as types from './integration.actionTypes';

// MODELS
import ObjectTypeMapping from '../../Models/ObjectTypeMapping.model';

// INITIAL STATE
import { initialState } from './integration.initialState';

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_DATA_FOR_DATA_SOURCE_SUCCESS: {
      const { payload: { actionMeta: { datasource }, objectFields } } = action;
      const objArr = Object.keys(objectFields).map(key => objectFields[key]);
      const objects = _.keyBy(objArr, 'te_extid');
      return {
        ...state,
        objects: {
          ...state.objects,
          [datasource]: objects,
        },
      };
    }

    case types.FETCH_MAPPING_SUCCESS: {
      const { payload: { mapping: { objectTypes } } } = action;
      const mappedObjectTypes = (objectTypes || []).reduce(
        (prev, curr) => ({
          ...prev,
          [curr.objectTypeExtId]: new ObjectTypeMapping(curr),
        }),
        {},
      );
      return {
        ...state,
        mappedObjectTypes,
      };
    }

    default:
      return state;
  }
};

export default reducer;
