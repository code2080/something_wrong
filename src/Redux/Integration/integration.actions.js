import { asyncAction } from '../../Utils/actionHelpers';
import {
  FETCH_INTEGRATION_SETTINGS_REQUEST,
  FETCH_INTEGRATION_SETTINGS_SUCCESS,
  FETCH_INTEGRATION_SETTINGS_FAILURE
} from './integration.actionTypes';

const fetchIntegrationSettingsFlow = {
  request: () => ({ type: FETCH_INTEGRATION_SETTINGS_REQUEST }),
  success: response => ({ type: FETCH_INTEGRATION_SETTINGS_SUCCESS, payload: { ...response } }),
  failure: err => ({ type: FETCH_INTEGRATION_SETTINGS_FAILURE, payload: { ...err } }),
};

export const fetchIntegrationSettings = () =>
  asyncAction.GET({
    flow: fetchIntegrationSettingsFlow,
    endpoint: 'integrations/object-types',
  });
