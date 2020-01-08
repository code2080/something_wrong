import { asyncAction } from '../../Utils/actionHelpers';
import {
  FETCH_MAPPINGS_FOR_FORM_REQUEST,
  FETCH_MAPPINGS_FOR_FORM_SUCCESS,
  FETCH_MAPPINGS_FOR_FORM_FAILURE,
  UPDATE_MAPPING_FOR_FORM_REQUEST,
  UPDATE_MAPPING_FOR_FORM_SUCCESS,
  UPDATE_MAPPING_FOR_FORM_FAILURE,
  CREATE_MAPPING_FOR_FORM_REQUEST,
  CREATE_MAPPING_FOR_FORM_SUCCESS,
  CREATE_MAPPING_FOR_FORM_FAILURE,
} from './mappings.actionTypes';

const fetchMappingsFlow = {
  request: () => ({ type: FETCH_MAPPINGS_FOR_FORM_REQUEST }),
  success: response => ({ type: FETCH_MAPPINGS_FOR_FORM_SUCCESS, payload: { ...response } }),
  failure: err => ({ type: FETCH_MAPPINGS_FOR_FORM_FAILURE, payload: { ...err } }),
};

export const fetchMappings = formId =>
  asyncAction.GET({
    flow: fetchMappingsFlow,
    endpoint: `forms/${formId}/mappings`,
    params: { formId },
  });

const createMappingFlow = {
  request: () => ({ type: CREATE_MAPPING_FOR_FORM_REQUEST }),
  success: response => ({ type: CREATE_MAPPING_FOR_FORM_SUCCESS, payload: { ...response } }),
  failure: err => ({ type: CREATE_MAPPING_FOR_FORM_FAILURE, payload: { ...err } }),
};

export const createMapping = mapping =>
  asyncAction.POST({
    flow: createMappingFlow,
    endpoint: `forms/${mapping.formId}/mappings`,
    params: {
      objects: mapping.objects,
      fields: mapping.fields,
      formId: mapping.formId,
      reservationTemplateExtId: mapping.reservationTemplateExtId,
    },
  });

const updateMappingFlow = {
  request: () => ({ type: UPDATE_MAPPING_FOR_FORM_REQUEST }),
  success: response => ({ type: UPDATE_MAPPING_FOR_FORM_SUCCESS, payload: { ...response } }),
  failure: err => ({ type: UPDATE_MAPPING_FOR_FORM_FAILURE, payload: { ...err } }),
};

export const updateMapping = mapping =>
  asyncAction.PUT({
    flow: updateMappingFlow,
    endpoint: `forms/${mapping.formId}/mappings/${mapping._id}`,
    params: { mapping },
  });
