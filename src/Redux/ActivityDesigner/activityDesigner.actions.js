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

const fetchMappingsFlow = (form) => ({
  request: () => ({ type: FETCH_MAPPINGS_FOR_FORM_REQUEST }),
  success: (response) => ({
    type: FETCH_MAPPINGS_FOR_FORM_SUCCESS,
    payload: { ...response, form },
  }),
  failure: (err) => ({
    type: FETCH_MAPPINGS_FOR_FORM_FAILURE,
    payload: { ...err },
  }),
});

export const fetchMappings = (form) =>
  asyncAction.GET({
    flow: fetchMappingsFlow(form),
    endpoint: `${getEnvParams().AM_BE_URL}forms/${form._id}/activity-designs`,
    params: { formId: form._id },
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
    endpoint: `${getEnvParams().AM_BE_URL}forms/${mapping.formId}/activity-designs`,
    params: { mapping },
  });

export const unlockActivityDesigner = ({ formId }) => ({
  type: UNLOCK_ACTIVITY_DESIGN,
  payload: { formId },
});
