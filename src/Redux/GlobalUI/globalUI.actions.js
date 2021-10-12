import { asyncAction } from '../../Utils/actionHelpers';
import { getEnvParams } from '../../configs';

import {
  SET_BREADCRUMBS,
  SET_EXTERNAL_ACTION,
  GET_VIEW_REQUEST,
  GET_VIEW_SUCCESS,
  GET_VIEW_FAILURE,
  UPDATE_VIEW_REQUEST,
  INIT_VIEW,
  UPDATE_VIEW_SUCCESS,
  UPDATE_VIEW_FAILURE,
  SET_FORM_DETAIL_TAB,
  GO_TO_PREVIOUS_TAB,
  SET_SORTING_FOR_ACTIVITIES,
  RESET_SORTING_FOR_ACTIVITIES,
} from './globalUI.actionTypes';

export const setBreadcrumbs = (fragments) => ({
  type: SET_BREADCRUMBS,
  payload: { fragments },
});

export const setExternalAction = (spotlightRef) => {
  const el = spotlightRef && spotlightRef.current;
  const spotlightPositionInfo = el
    ? {
        boundingRect: spotlightRef.current.getBoundingClientRect(),
      }
    : null;
  return {
    type: SET_EXTERNAL_ACTION,
    payload: { spotlightPositionInfo },
  };
};

export const initView = (datasourceId, columns) => ({
  type: INIT_VIEW,
  payload: { datasourceId, columns },
});

const getViewFlow = {
  request: () => ({ type: GET_VIEW_REQUEST }),
  success: (response) => ({ type: GET_VIEW_SUCCESS, payload: { ...response } }),
  failure: (err) => ({ type: GET_VIEW_FAILURE, payload: { ...err } }),
};

export const getView = (datasourceId) => (dispatch, getState) => {
  const { VIEWS_URL, APP_NAME } = getEnvParams();
  const storeState = getState();
  const {
    auth: {
      user: { id, organizationId },
    },
  } = storeState;
  dispatch(
    asyncAction.GET({
      flow: getViewFlow,
      endpoint: `${VIEWS_URL}tables/${APP_NAME}/${datasourceId}/${organizationId}/${id}`,
      requiresAuth: false,
    }),
  );
};

const updateViewFlow = {
  request: (payload) => ({ type: UPDATE_VIEW_REQUEST, payload }),
  success: (response) => ({
    type: UPDATE_VIEW_SUCCESS,
    payload: { ...response },
  }),
  failure: (err) => ({ type: UPDATE_VIEW_FAILURE, payload: { ...err } }),
};

export const updateView =
  (datasourceId, visibleCols) => (dispatch, getState) => {
    const { VIEWS_URL, APP_NAME } = getEnvParams();
    const storeState = getState();
    const {
      auth: {
        user: { id, organizationId },
      },
    } = storeState;
    dispatch(
      asyncAction.PUT({
        flow: updateViewFlow,
        endpoint: `${VIEWS_URL}tables/${APP_NAME}/${datasourceId}/${organizationId}/${id}`,
        params: { columns: visibleCols, datasourceId, pageSize: 100 },
        requiresAuth: false,
      }),
    );
  };

export const setFormDetailTab = (tab, submission = null) => ({
  type: SET_FORM_DETAIL_TAB,
  payload: { tab, submission },
});

export const goToPreviousTab = () => ({
  type: GO_TO_PREVIOUS_TAB,
});

export const setActivitySorting = (
  formId,
  columnKey,
  direction,
  tableType,
) => ({
  type: SET_SORTING_FOR_ACTIVITIES,
  payload: { formId, columnKey, direction, tableType },
});

export const resetActivitySorting = (formId, tableType) => ({
  type: RESET_SORTING_FOR_ACTIVITIES,
  payload: { formId, tableType },
});
