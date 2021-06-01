import {
  EActivityFilterInclusion,
  EActivityFilterMode,
  EActivityFilterType,
} from '../../Types/ActivityFilter.interface';
import { asyncAction } from '../../Utils/actionHelpers';
import { getEnvParams } from '../../configs';
import { TProperty } from '../../Types/property.type';
import * as types from './filters.actionTypes';

// TYPES
type TActionLoadFilter = {
  filterId: string;
};

type TActionUpdateFilter = {
  filterId: string;
  key: string;
  value: any;
};

type TActionSetFilter = {
  filterId: string;
  filter: object;
};

type TActivityFilterOptions = {
  extId: string;
  values: TProperty[];
};

type TActionSetOptions = {
  filterId: string;
  optionType: EActivityFilterType;
  optionPayload: TActivityFilterOptions;
  activityId?: string;
};

type TActionSetActivityFilterMode = {
  filterId: string;
  mode: EActivityFilterMode;
};

type TActionSetActivityFilterInclusion = {
  filterId: string;
  inclusion: EActivityFilterInclusion;
};

type TActionSetActivityLookupMap = {
  formId: string;
};

type TActionSetSelectedFilterValues = {
  filterValues: { [property: string]: string[] };
  formId: string;
};

const setSelectedFilterValuesFlow = {
  request: () => ({ type: types.LOAD_SELECTED_FILTER_VALUES_REQUEST }),
  success: (response) => ({
    type: types.LOAD_SELECTED_FILTER_VALUES_SUCCESS,
    payload: { ...response },
  }),
  failure: (err) => ({
    type: types.LOAD_SELECTED_FILTER_VALUES_FAILURE,
    payload: { ...err },
  }),
};

export const setSelectedFilterValues = (
  payload: TActionSetSelectedFilterValues,
) =>
  asyncAction.POST({
    flow: setSelectedFilterValuesFlow,
    endpoint: `${getEnvParams().AM_BE_URL}forms/:formId/activities/filters`,
    payload,
  });

const fetchLookupMapFlow = {
  request: () => ({ type: types.FETCH_FORM_LOOKUPMAP_REQUEST }),
  success: (response) => ({
    type: types.FETCH_FORM_LOOKUPMAP_SUCCESS,
    payload: { ...response },
  }),
  failure: (err) => ({
    type: types.FETCH_FORM_LOOKUPMAP_FAILURE,
    payload: { ...err },
  }),
};

export const fetchLookupMap = (payload: TActionSetActivityLookupMap) => {
  const { formId = '' } = payload;
  return asyncAction.GET({
    flow: fetchLookupMapFlow,
    endpoint: `${getEnvParams().AM_BE_URL}forms/${formId}/activities/filters`,
    params: { formId },
  });
};

export const loadFilter = ({ filterId }: TActionLoadFilter) => ({
  type: types.LOAD_FILTER,
  payload: { filterId },
});

export const updateFilter = ({
  filterId,
  key,
  value,
}: TActionUpdateFilter) => ({
  type: types.UPDATE_FILTER,
  payload: { filterId, key, value },
});

export const setFilter = ({ filterId, filter }: TActionSetFilter) => ({
  type: types.SET_FILTER,
  payload: { filterId, filter },
});

export const setActivityFilter = ({ filterId, options, matches }) => ({
  type: types.SET_ACTIVITY_FILTER,
  payload: { filterId, options, matches },
});

export const setActivityFilterOptions = ({
  filterId,
  optionType,
  optionPayload,
  activityId,
}: TActionSetOptions) => ({
  type: types.SET_ACTIVITY_FILTER_OPTIONS,
  payload: { filterId, optionType, optionPayload, activityId },
});

export const setActivityFilterMode = ({
  filterId,
  mode,
}: TActionSetActivityFilterMode) => ({
  type: types.SET_ACTIVITY_FILTER_MODE,
  payload: { filterId, mode },
});

export const setActivityFilterInclusion = ({
  filterId: _,
  inclusion: __,
}: TActionSetActivityFilterInclusion) => ({
  type: types.SET_ACTIVITY_FILTER_INCLUSION,
});
