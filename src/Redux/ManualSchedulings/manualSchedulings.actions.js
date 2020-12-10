import { asyncAction } from '../../Utils/actionHelpers';
import * as types from './manualSchedulings.actionTypes';

const toggleRowSchedulingStatusFlow = {
  request: () => ({ type: types.TOGGLE_ROW_SCHEDULING_STATUS_REQUEST }),
  success: response => ({
    type: types.TOGGLE_ROW_SCHEDULING_STATUS_SUCCESS,
    payload: { ...response }
  }),
  failure: err => ({
    type: types.TOGGLE_ROW_SCHEDULING_STATUS_FAILURE,
    payload: { ...err }
  })
};

export const toggleRowSchedulingStatus = ({
  formInstanceId,
  sectionId,
  rowKey
}) =>
  asyncAction.PUT({
    flow: toggleRowSchedulingStatusFlow,
    endpoint: `form-instances/${encodeURIComponent(formInstanceId)}/te-core/manual-scheduling/${encodeURIComponent(sectionId)}/${encodeURIComponent(rowKey)}`,
  });

const fetchManualSchedulingsForFormInstanceFlow = {
  request: () => ({ type: types.FETCH_FORM_INSTANCE_MANUAL_SCHEDULINGS_REQUEST }),
  success: response => ({
    type: types.FETCH_FORM_INSTANCE_MANUAL_SCHEDULINGS_SUCCESS,
    payload: { ...response }
  }),
  failure: err => ({
    type: types.FETCH_FORM_INSTANCE_MANUAL_SCHEDULINGS_FAILURE,
    payload: { ...err }
  })
};

export const fetchManualSchedulingsForFormInstance = ({
  formInstanceId,
}) =>
  asyncAction.GET({
    flow: fetchManualSchedulingsForFormInstanceFlow,
    endpoint: `form-instances/${encodeURIComponent(formInstanceId)}/te-core/manual-scheduling`,
  });
