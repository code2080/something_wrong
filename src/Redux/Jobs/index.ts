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
  updateEntity,
} from '../../Components/SSP/Utils/sliceHelpers';

// UTILS
import { serializeSSPQuery } from 'Components/SSP/Utils/helpers';

// TYPES
import { createFn as createJobFn, TJob } from 'Types/Job.type';
import {
  ISSPReducerState,
  ISSPQueryObject,
  EFilterType,
  EFilterInclusions,
} from 'Types/SSP.type';
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
  inclusion: {
    jointTeaching: EFilterInclusions.INCLUDE,
  },
  filters: {},
  filterLookupMap: {},
  workerStatus: undefined,
};

// Slice
const slice = createSlice({
  name: 'jobs',
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
    fetchJobsForFormSuccess: (state, { payload }) => {
      commitAPIPayloadToState(payload, state, createJobFn);
      updateResourceWorkerStatus(payload, state);
      finishedLoadingSuccess(state);
    },
    updateJobSuccess: (state, { payload }) => {
      updateEntity(state, payload, createJobFn, '_id');
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
export const jobsSelector = (state: IState): TJob[] =>
  state.jobs.data[state.jobs.groupBy].results;
export const jobSelector =
  (id: string) =>
  (state: IState): TJob | undefined =>
    state.jobs.data[state.jobs.groupBy][id] || undefined;
export const jobsLoading = (state: IState): boolean => state.jobs.loading;
export const selectRunningJobId = (state: IState) => state.jobs.workerStatus;

// Actions
export const {
  defaultRequestHandler,
  defaultFailureHandler,
  initializeSSPStateProps,
  fetchJobsForFormSuccess,
  resetState,
  updateWorkerStatus,
  updateJobSuccess,
} = slice.actions;

export const fetchJobsForForm =
  (formId: string, queryObject?: Partial<ISSPQueryObject>) =>
  async (dispatch: any, getState: () => IState) => {
    try {
      const serializedQuery = serializeSSPQuery(
        queryObject,
        getState().jobs,
      );
      dispatch(defaultRequestHandler(queryObject));
      const result = await api.get({
        endpoint: `forms/${formId}/jobs?${serializedQuery}`,
      });
      dispatch(fetchJobsForFormSuccess(result));
    } catch (e) {
      dispatch(defaultFailureHandler(null));
    }
  };

export const stopJob =
  (formId: string, jobId: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(defaultRequestHandler(null));
      const result = await api.post({
        endpoint: `forms/${formId}/jobs/${jobId}/stop`,
      });
      dispatch(updateJobSuccess(result));
    } catch (e) {
      dispatch(defaultFailureHandler(null));
    }
  };
