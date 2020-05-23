import _ from 'lodash';
import { asyncAction } from '../../Utils/actionHelpers';
import * as types from './integration.actionTypes';

const fetchMappingFlow = {
  request: () => ({ type: types.FETCH_MAPPING_REQUEST }),
  success: response => ({
    type: types.FETCH_MAPPING_SUCCESS,
    payload: { ...response },
  }),
  failure: err => ({
    type: types.FETCH_MAPPING_FAILURE,
    payload: { ...err },
  })
};

export const fetchMapping = () => (dispatch, getState) => {
  const storeState = getState();
  const organizationId = _.get(storeState, 'auth.user.organizationId', null);
  return dispatch(
    asyncAction.GET({
      flow: fetchMappingFlow,
      endpoint: `integration-service/service/tePref/mapping/${organizationId}`
    })
  );
};

const fetchDataForDataSourceFlow = {
  request: params => ({
    type: types.FETCH_DATA_FOR_DATA_SOURCE_REQUEST,
    payload: { datasource: params.datasource },
  }),
  success: (response, params) => ({
    type: types.FETCH_DATA_FOR_DATA_SOURCE_SUCCESS,
    payload: { objectFields: response, actionMeta: { ...params } },
  }),
  failure: (err, params) => ({
    type: types.FETCH_DATA_FOR_DATA_SOURCE_FAILURE,
    payload: { ...err, actionMeta: { ...params } },
  }),
};

export const fetchDataForDataSource = (datasource) => (dispatch, getState) => {
  const storeState = getState();
  const organizationId = _.get(storeState, 'auth.user.organizationId', null);
  return dispatch(
    asyncAction.GET({
      flow: fetchDataForDataSourceFlow,
      endpoint: `integration-service/service/tePref/integration/${organizationId}/object/types/${datasource}?applyOutputObjectMapping=true`,
      params: { datasource },
    })
  );
};
