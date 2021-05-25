import { asyncAction } from '../../Utils/actionHelpers';
import { getEnvParams } from '../../configs';
import {
  FETCH_MAPPINGS_FOR_FORM_REQUEST,
  FETCH_MAPPINGS_FOR_FORM_SUCCESS,
  FETCH_MAPPINGS_FOR_FORM_FAILURE,
  UPDATE_MAPPING_FOR_FORM_REQUEST,
  UPDATE_MAPPING_FOR_FORM_SUCCESS,
  UPDATE_MAPPING_FOR_FORM_FAILURE,
  UNLOCK_ACTIVITY_DESIGN,
} from './activityDesigner.actionTypes';

const fetchMappingsFlow = {
  request: () => ({ type: FETCH_MAPPINGS_FOR_FORM_REQUEST }),
  success: (response) => ({
    type: FETCH_MAPPINGS_FOR_FORM_SUCCESS,
    payload: { ...response },
  }),
  failure: (err) => ({
    type: FETCH_MAPPINGS_FOR_FORM_FAILURE,
    payload: { ...err },
  }),
};

export const fetchMappings = (formId) =>
  asyncAction.GET({
    flow: fetchMappingsFlow,
    endpoint: `${getEnvParams().AM_BE_URL}activity-designs`,
    params: { formId },
  });

const updateDesignFlow = {
  request: () => ({ type: UPDATE_MAPPING_FOR_FORM_REQUEST }),
  success: (response) => ({
    type: UPDATE_MAPPING_FOR_FORM_SUCCESS,
    payload: { ...response },
  }),
  failure: (err) => ({
    type: UPDATE_MAPPING_FOR_FORM_FAILURE,
    payload: { ...err },
  }),
};

export const updateDesign = (mapping) =>
  asyncAction.POST({
    flow: updateDesignFlow,
    endpoint: `${getEnvParams().AM_BE_URL}activity-designs`,
    params: { mapping },
  });

export const unlockActivityDesigner = ({ formId }) => ({
  type: UNLOCK_ACTIVITY_DESIGN,
  payload: { formId }
})

