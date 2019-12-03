import { SET_TE_DATA_FOR_VALUES } from './te.actionTypes';

export const setTEDataForValues = (extIdProps = {}) => ({
  type: SET_TE_DATA_FOR_VALUES,
  payload: { extIdProps },
});
