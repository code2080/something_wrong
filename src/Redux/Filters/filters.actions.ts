import { EActivityFilterInclusion, EActivityFilterMode, EActivityFilterType } from '../../Types/ActivityFilter.interface';
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
  extId: string,
  values: TProperty[],
};

type TActionSetOptions = {
  filterId: string;
  optionType: EActivityFilterType,
  optionPayload: TActivityFilterOptions,
  activityId?: string;
};

type TActionSetActivityFilterMode = {
  filterId: string;
  mode: EActivityFilterMode;
}

type TActionSetActivityFilterInclusion = {
  filterId: string;
  inclusion: EActivityFilterInclusion;
}

export const loadFilter = ({ filterId }: TActionLoadFilter) => ({
  type: types.LOAD_FILTER,
  payload: { filterId },
});

export const updateFilter = ({ filterId, key, value, }: TActionUpdateFilter) => ({
  type: types.UPDATE_FILTER,
  payload: { filterId, key, value },
});

export const setFilter = ({ filterId, filter }: TActionSetFilter) => ({
  type: types.SET_FILTER,
  payload: { filterId, filter },
});

export const setActivityFilterOptions = ({ filterId, optionType, optionPayload, activityId }: TActionSetOptions) => ({
  type: types.SET_ACTIVITY_FILTER_OPTIONS,
  payload: { filterId, optionType, optionPayload, activityId },
});

export const setActivityFilterMode = ({ filterId, mode }: TActionSetActivityFilterMode) => ({
  type: types.SET_ACTIVITY_FILTER_MODE,
  payload: { filterId, mode },
});

export const setActivityFilterInclusion = ({ filterId, inclusion }: TActionSetActivityFilterInclusion) => ({
  type: types.SET_ACTIVITY_FILTER_INCLUSION,
  payload: { filterId, inclusion },
});
