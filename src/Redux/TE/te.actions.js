import * as types from './te.actionTypes';

export const setTEDataForValues = (extIdProps = {}) => ({
  type: types.SET_TE_DATA_FOR_VALUES,
  payload: { extIdProps },
});

export const setExtIdPropsForObject = (extId, extIdProps) => ({
  type: types.SET_EXTID_PROPS_FOR_OBJECT,
  payload: { extId, extIdProps },
});
