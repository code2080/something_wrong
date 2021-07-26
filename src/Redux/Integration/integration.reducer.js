import _ from 'lodash';
import * as types from './integration.actionTypes';

// MODELS
import ObjectTypeMapping from '../../Models/ObjectTypeMapping.model';

// INITIAL STATE
import { initialState } from './integration.initialState';

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_DATA_FOR_DATA_SOURCE_SUCCESS: {
      const {
        payload: {
          actionMeta: { datasource },
          objectFields,
        },
      } = action;
      const objArr = Object.keys(objectFields).map((key) => objectFields[key]);
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
      const {
        payload: {
          mapping: { objectTypes },
        },
      } = action;
      const mappedObjectTypes = (objectTypes || []).reduce(
        (prev, curr) => ({
          ...prev,
          [curr.objectTypeExtId]: new ObjectTypeMapping(curr),
        }),
        {},
      );
      const mappedObjectsLabel = (objectTypes || []).reduce(
        (results, objectType) => ({
          ...results,
          [objectType.objectTypeExtId]: objectType.applicationObjectTypeLabel
        }), {}
      );
      const mappedFieldsLabel = (objectTypes || []).reduce(
        (results, objectType) => ({
          ...results,
          ...(objectType.fields || []).reduce((fieldResults, field) => ({
            ...fieldResults,
            [field.fieldExtId]: field.fieldLabel
          }), {}),
        }), {}
      );

      return {
        ...state,
        mappedObjectTypes,
        mappedObjectsLabel,
        mappedFieldsLabel,
      };
    }

    case types.FETCH_TYPES_ON_RESERVATION_MODE_SUCCESS: {
      const {
        type,
        actionMeta: { reservationMode },
      } = action.payload;
      return {
        ...state,
        reservationModes: {
          ...state.reservationModes,
          [reservationMode]: {
            ...(state.reservationModes[reservationMode] || {}),
            types: type,
          },
        },
      };
    }

    case types.FETCH_FIELDS_ON_RESERVATION_MODE_SUCCESS: {
      const {
        actionMeta: { reservationMode },
        ...fields
      } = action.payload;
      return {
        ...state,
        reservationModes: {
          ...state.reservationModes,
          [reservationMode]: {
            ...(state.reservationModes[reservationMode] || {}),
            fields: Object.keys(fields).map((n) => fields[n]),
          },
        },
      };
    }

    default:
      return state;
  }
};

export default reducer;
