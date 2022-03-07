import { createSlice } from '@reduxjs/toolkit';
import api from '../../Services/api.service';

// ACTIONS
import {
  finishedLoadingFailure,
  finishedLoadingSuccess,
  beginLoading,
  commitAPIPayloadToState,
} from '../../Utils/sliceHelpers.utils';

// UTILS
import { serializeSSPQuery } from 'Components/SSP/Utils/helpers';

// TYPES
import { createFn, TActivity } from 'Types/Activity.type';
import { createFn as createActivityFilterLookupMap, TActivityFilterLookupMap } from 'Types/ActivityFilterLookupMap.type';
import { ISSPReducerState, ISSPQueryObject, ESortDirection, EFilterType, EFilterInclusions } from 'Types/SSP.type';
import { IState } from 'Types/State.type';

export const initialState: ISSPReducerState = {
  // API STATE
  loading: false,
  hasErrors: false,
  // DATA
  results: [],
  map: {},
  // SORTING
  sortBy: '',
  direction: ESortDirection.ASCENDING,
  // FILTERING
  matchType: EFilterType.ALL,
  inclusion: {
    fullSubmission: false,
    jointTeaching: EFilterInclusions.INCLUDE,
  },
  filters: {},
  filterLookupMap: {},
  // PAGINATION
  page: 1,
  limit: 10,
  totalPages: 10,
};

// Slice
const slice = createSlice({
  name: 'activitiesNew',
  initialState,
  reducers: {
    defaultRequestHandler: (state) => {
      beginLoading(state);
    },
    defaultFailureHandler: (state) => {
      finishedLoadingFailure(state);
    },
    fetchActivitiesForFormSuccess: (state, { payload }) => {
      commitAPIPayloadToState(payload, state, createFn);
      finishedLoadingSuccess(state);
    },
    fetchActivityFilterLookupMapSuccess: (state, { payload }) => {
      const lookupMap = createActivityFilterLookupMap(payload);
      state.filterLookupMap = lookupMap;
      finishedLoadingSuccess(state);
    },
  },
});

export default slice.reducer;

// Selectors
export const activitiesSelector = (state: IState): TActivity[] =>
  state.activitiesNew.results;
export const activitySelector = (id: string) => (state: IState): TActivity | undefined => state.activitiesNew.map[id] || undefined;
export const activitiesLoading = (state: IState): boolean => state.activitiesNew.loading;
export const activityFilterLookupMapSelector = (state: IState): TActivityFilterLookupMap => state.activitiesNew.filterLookupMap;

// Actions
export const {
  defaultRequestHandler,
  defaultFailureHandler,
  fetchActivitiesForFormSuccess,
  fetchActivityFilterLookupMapSuccess,
} = slice.actions;

export const fetchActivitiesForForm = (formId: string, queryObject?: Partial<ISSPQueryObject>) => async (dispatch: any, getState: any) => {
  try {
    dispatch(defaultRequestHandler());
    const serializedQuery = serializeSSPQuery(queryObject, getState().activitiesNew);
    const result = await api.get({
      endpoint: `forms/${formId}/activities?${serializedQuery}`,
    });
    dispatch(fetchActivitiesForFormSuccess(result));
  } catch (e) {
    dispatch(defaultFailureHandler());
  }
};

export const fetchActivityFilterLookupMapForForm = (formId: string) => async (dispatch: any) => {
  try {
    dispatch(defaultRequestHandler());
    const result = await api.get({
      endpoint: `forms/${formId}/activities/filters`,
    });
    dispatch(fetchActivityFilterLookupMapSuccess(result));
  } catch (e) {
    dispatch(defaultFailureHandler());
  }
};

