import { createSlice } from '@reduxjs/toolkit';
import api from '../../Services/api.service';

// ACTIONS
import {
  finishedLoadingFailure,
  finishedLoadingSuccess,
  beginLoading,
  commitAPIPayloadToState,
  commitSSPQueryToState,
  resetSSPState,
  updateResourceWorkerStatus,
} from '../../Components/SSP/Utils/sliceHelpers';

// UTILS
import { serializeSSPQuery } from 'Components/SSP/Utils/helpers';

// TYPES
import { createFn, TActivityTypeTrackGroup } from 'Types/GroupManagement.type';
import { ISSPReducerState, ISSPQueryObject, EFilterType } from 'Types/SSP.type';
import { IState } from 'Types/State.type';
import { AppDispatch } from 'Redux/store';
import { EActivityGroupings } from 'Types/Activity/ActivityGroupings.enum';

export const initialState: ISSPReducerState = {
  // API STATE
  loading: false,
  hasErrors: false,
  filterLookupMapLoading: false,
  // GROUPING
  groupBy: EActivityGroupings.FLAT,
  // DATA
  data: {
    [EActivityGroupings.FLAT]: {
      results: [],
      map: {},
      sortBy: undefined,
      direction: undefined,
      page: 1,
      limit: 10,
      totalPages: 10,
      allKeys: [],
    },
  },
  // FILTERING
  matchType: EFilterType.ALL,
  inclusion: {},
  filters: {},
  filterLookupMap: {},
  workerStatus: undefined,
  metadata: {},
};

// Slice
const slice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    defaultRequestHandler: (state, { payload }) => {
      beginLoading(state, payload?.loadingProp || 'loading');
      if (payload) commitSSPQueryToState(payload, state);
    },
    defaultFailureHandler: (state, { payload }) => {
      finishedLoadingFailure(state, payload?.loadingProp || 'loading');
    },
    initializeSSPStateProps: (state, { payload }) => {
      if (payload) commitSSPQueryToState(payload, state);
    },
    fetchGroupsForFormSuccess: (state, { payload }) => {
      commitAPIPayloadToState(payload, state, createFn);
      updateResourceWorkerStatus(payload, state);
      (state.metadata as Record<string, any>).queryHash = payload.queryHash;
      finishedLoadingSuccess(state);
    },
    updateGroupsForFormSuccess: (state) => {
      finishedLoadingSuccess(state);
    },
    resetState: (state) => {
      resetSSPState(state);
    },
    updateWorkerStatus: (state, { payload }) => {
      updateResourceWorkerStatus({ workerStatus: payload }, state);
    },
  },
});

export default slice.reducer;

// Selectors
export const groupsSelector = (state: IState): TActivityTypeTrackGroup[] =>
  state.groups.data[state.groups.groupBy].results;
export const jobSelector =
  (id: string) =>
  (state: IState): TActivityTypeTrackGroup | undefined =>
    state.groups.data[state.groups.groupBy][id] || undefined;
export const groupsLoading = (state: IState): boolean => state.groups.loading;

// Actions
export const {
  defaultRequestHandler,
  defaultFailureHandler,
  initializeSSPStateProps,
  fetchGroupsForFormSuccess,
  resetState,
  updateWorkerStatus,
  updateGroupsForFormSuccess,
} = slice.actions;

export const fetchGroupsForForm =
  (formId: string, queryObject?: Partial<ISSPQueryObject>) =>
  async (dispatch: AppDispatch, getState: () => IState) => {
    try {
      const serializedQuery = serializeSSPQuery(queryObject, getState().groups);
      dispatch(defaultRequestHandler(queryObject));
      const result = await api.get({
        endpoint: `forms/${formId}/groups?${serializedQuery}`,
      });
      dispatch(fetchGroupsForFormSuccess(result));
    } catch (e) {
      dispatch(defaultFailureHandler(null));
    }
  };

// todo: a good name
export const allocateGroups =
  (formId: string, activityIds: string[]) => async (dispatch: AppDispatch, getState: () => IState) => {
    try {
      dispatch(defaultRequestHandler(null));
      const state = getState().groups;
      const { metadata } = state;
      await api.post({
        endpoint: `forms/${formId}/groups/allocate`,
        data: { activityIds, groupTypeExtId: metadata?.groupTypeExtId || undefined, queryHash: metadata?.queryHash || undefined },
        successMessage: "Allocation successfully completed",
      });

      dispatch(updateGroupsForFormSuccess());
    } catch (e) {
      dispatch(defaultFailureHandler(null));
    }
  };
