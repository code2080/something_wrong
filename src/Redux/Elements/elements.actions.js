import { asyncAction } from '../../Utils/actionHelpers';
import * as types from './elements.actionTypes';

const fetchElementsFlow = {
  request: () => ({ type: types.FETCH_ELEMENTS_REQUEST }),
  success: (response) => ({
    type: types.FETCH_ELEMENTS_SUCCESS,
    payload: { ...response },
  }),
  failure: (err) => ({
    type: types.FETCH_ELEMENTS_FAILURE,
    payload: { ...err },
  }),
};

export const fetchElements = () =>
  asyncAction.GET({
    flow: fetchElementsFlow,
    endpoint: 'elements',
    requiresAuth: true,
  });
