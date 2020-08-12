import { asyncAction } from '../../Utils/actionHelpers';
import { getEnvParams } from '../../configs';

import {
  SET_BREADCRUMBS,
  BEGIN_EXTERNAL_ACTION,
  END_EXTERNAL_ACTION,
  GET_VIEW_REQUEST,
  GET_VIEW_SUCCESS,
  GET_VIEW_FAILURE,
  UPDATE_VIEW_REQUEST,
  INIT_VIEW,
  UPDATE_VIEW_SUCCESS,
  UPDATE_VIEW_FAILURE,
} from './globalUI.actionTypes';

export const setBreadcrumbs = fragments => ({
  type: SET_BREADCRUMBS,
  payload: { fragments },
});

export const beginExternalAction = (activityId, prop) => ({
  type: BEGIN_EXTERNAL_ACTION,
  payload: { activityId, prop },
});

export const endExternalAction = () => ({
  type: END_EXTERNAL_ACTION
});

export const initView = (datasourceId, columns) => ({ type: INIT_VIEW, payload: { datasourceId, columns } });

const getViewFlow = {
  request: () => ({ type: GET_VIEW_REQUEST }),
  success: response => ({ type: GET_VIEW_SUCCESS, payload: { ...response } }),
  failure: err => ({ type: GET_VIEW_FAILURE, payload: { ...err } }),
};

export const getView = datasourceId => (dispatch, getState) => {
  const { VIEWS_URL, APP_NAME } = getEnvParams();
  const storeState = getState();
  const { auth: { user: { id, organizationId } } } = storeState;
  dispatch(asyncAction.GET({
    flow: getViewFlow,
    endpoint: `${VIEWS_URL}tables/${APP_NAME}/${datasourceId}/${organizationId}/${id}`,
    requiresAuth: false,
  }));
};

const updateViewFlow = {
  request: payload => ({ type: UPDATE_VIEW_REQUEST, payload }),
  success: response => ({ type: UPDATE_VIEW_SUCCESS, payload: { ...response } }),
  failure: err => ({ type: UPDATE_VIEW_FAILURE, payload: { ...err } }),
};

export const updateView = (datasourceId, visibleCols) => (dispatch, getState) => {
  const { VIEWS_URL, APP_NAME } = getEnvParams();
  const storeState = getState();
  const { auth: { user: { id, organizationId } } } = storeState;
  dispatch(asyncAction.PUT({
    flow: updateViewFlow,
    endpoint: `${VIEWS_URL}tables/${APP_NAME}/${datasourceId}/${organizationId}/${id}`,
    params: { columns: visibleCols, datasourceId, pageSize: 100 },
    requiresAuth: false,
  }));
};
