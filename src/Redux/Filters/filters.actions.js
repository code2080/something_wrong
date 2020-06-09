import * as types from './filters.actionTypes';

export const loadFilter = ({ filterId }) => ({
  type: types.LOAD_FILTER,
  payload: { filterId },
});

export const updateFilter = ({ filterId, key, value, }) => ({
  type: types.UPDATE_FILTER,
  payload: { filterId, key, value },
});

export const setFilter = ({ filterId, filter }) => ({
  type: types.SET_FILTER,
  payload: { filterId, filter },
});
