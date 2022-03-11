import { createSlice } from '@reduxjs/toolkit';
import api from '../../Services/api.service';

// ACTIONS
import {
  finishedLoadingFailure,
  finishedLoadingSuccess,
  beginLoading,
  commitAPIPayloadToState,
  commitSSPQueryToState,
  updateStateWithResultFromBatchOperation,
} from '../../Components/SSP/Utils/sliceHelpers';
import {
  excludeEmptyKeysFromFilterLookupMap,
  getAllFilterOptionsFromFilterLookupMap,
  toActivityStatusDisplay,
} from '../../Components/ActivitySSPFilters/helpers';

// SELECTS
import { selectAllLabels } from 'Redux/TE/te.selectors';
import { tagsSelector } from 'Redux/Tags';
import { selectAllRecipientsFromSubmissionFromForm } from 'Redux/FormSubmissions/formSubmissions.selectors';
import { selectFieldLabelsMapping, selectObjectLabelsMapping } from 'Redux/Integration/integration.selectors';

// UTILS
import { serializeSSPQuery } from 'Components/SSP/Utils/helpers';

// TYPES
import { createFn, TActivity } from 'Types/Activity.type';
import { createFn as createActivityFilterLookupMap, TActivityFilterLookupMap } from 'Types/ActivityFilterLookupMap.type';
import { ISSPReducerState, ISSPQueryObject, EFilterType, EFilterInclusions } from 'Types/SSP.type';
import { IState } from 'Types/State.type';
import { TActivityTag } from 'Types/ActivityTag.type';
import { EActivityStatus } from 'Types/ActivityStatus.enum';
import { CActivityBatchOperationURL, EActivityBatchOperation, TActivityBatchOperation } from 'Types/ActivityBatchOperations.type';


export const initialState: ISSPReducerState = {
  // API STATE
  loading: false,
  hasErrors: false,
  // DATA
  results: [],
  map: {},
  // SORTING
  sortBy: undefined,
  direction: undefined,
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
  // SELECTION
  allKeys: [],
};

// Slice
const slice = createSlice({
  name: 'activitiesNew',
  initialState,
  reducers: {
    defaultRequestHandler: (state, { payload }) => {
      beginLoading(state);
      if (payload) commitSSPQueryToState(payload, state);
    },
    defaultFailureHandler: (state) => {
      finishedLoadingFailure(state);
    },
    initializeSSPStateProps: (state, { payload }) => {
      if (payload) commitSSPQueryToState(payload, state);
    },
    fetchActivitiesForFormSuccess: (state, { payload }) => {
      commitAPIPayloadToState(payload, state, createFn);
      finishedLoadingSuccess(state);
    },
    fetchActivityFilterLookupMapSuccess: (state, { payload }) => {
      const lookupMap = createActivityFilterLookupMap(payload);
      state.filterLookupMap = lookupMap;
      // finishedLoadingSuccess(state); @todo break out into separate loading component
    },
    defaultBatchOperationSuccessHandler: (state, { payload }) => {
      updateStateWithResultFromBatchOperation(payload, state);
      finishedLoadingSuccess(state);
    },
  },
});

export default slice.reducer;

// Selectors
export const activitiesSelector = (state: IState): TActivity[] =>
  state.activitiesNew.results;
export const activitySelector =
  (id: string) =>
  (state: IState): TActivity | undefined =>
    state.activitiesNew.map[id] || undefined;
export const activitiesLoading = (state: IState): boolean =>
  state.activitiesNew.loading;
export const activityFilterLookupMapSelector = (
  state: IState,
): TActivityFilterLookupMap => state.activitiesNew.filterLookupMap;

/**
 * ALWAYS use this selector in case you're planning on using the map for filtering
 * It executes various convenience functions against the raw map before returning it
 */
export const selectLookupMapForFiltering = (
  state: IState,
): TActivityFilterLookupMap => {
  // Get the raw map from state
  const rawMap = state.activitiesNew.filterLookupMap;
  // Filter out all properties with only 'null' or 'undefined' as keys, except for in excluded keys
  return excludeEmptyKeysFromFilterLookupMap(rawMap, ['tag']);
};

export const selectAllFilterOptions =
  (filterProperty: string) =>
  (state: IState): string[] => {
    // Get the raw map from state
    const map = selectLookupMapForFiltering(state);
    const options = getAllFilterOptionsFromFilterLookupMap(map);
    return options[filterProperty] || [];
  };

export const selectLabelsForFilterOptionsForForm =
  (formId: string) => (state: IState) => {
    const objectLabelsMapping = selectObjectLabelsMapping()(state);
    const fieldsLabelMapping = selectFieldLabelsMapping()(state);
    const allLabels = selectAllLabels()(state);
    const tags = tagsSelector(state);
    const submitter = selectAllRecipientsFromSubmissionFromForm(formId)(state);

    return {
      submitter,
      tag: {
        ...tags.reduce(
          (tot: Record<string, string>, tag: TActivityTag) => ({
            ...tot,
            [tag._id]: tag.name,
          }),
          {},
        ),
        null: 'N/A',
      },
      status: Object.keys(EActivityStatus).reduce(
        (tot, tagId) => ({ ...tot, [tagId]: toActivityStatusDisplay(tagId) }),
        {},
      ),
      ...objectLabelsMapping,
      ...fieldsLabelMapping,
      ...allLabels,
    };
  };

// Actions
export const {
  defaultRequestHandler,
  defaultFailureHandler,
  initializeSSPStateProps,
  fetchActivitiesForFormSuccess,
  fetchActivityFilterLookupMapSuccess,
  defaultBatchOperationSuccessHandler,
} = slice.actions;

export const fetchActivitiesForForm =
  (formId: string, queryObject?: Partial<ISSPQueryObject>) =>
  async (dispatch: any, getState: any) => {
    try {
      const serializedQuery = serializeSSPQuery(
        queryObject,
        getState().activitiesNew,
      );
      dispatch(defaultRequestHandler(queryObject));
      const result = await api.get({
        endpoint: `forms/${formId}/activities?${serializedQuery}`,
      });
      dispatch(fetchActivitiesForFormSuccess(result));
    } catch (e) {
      dispatch(defaultFailureHandler());
    }
  };

export const fetchActivityFilterLookupMapForForm =
  (formId: string) => async (dispatch: any) => {
    try {
      dispatch(defaultRequestHandler(null));
      const result = await api.get({
        endpoint: `forms/${formId}/activities/filters`,
      });
      dispatch(fetchActivityFilterLookupMapSuccess(result));
    } catch (e) {
      dispatch(defaultFailureHandler());
    }
  };


const generalBatchOperationFn = (formId: string, batchOperation: TActivityBatchOperation, boUrl: string) => 
  async (dispatch: any) => {
    try {
      dispatch(defaultRequestHandler(null));
      await api.post({
        endpoint: `forms/${formId}/activities/batch-operations/${boUrl}`,
        data: batchOperation,
      });
      dispatch(defaultBatchOperationSuccessHandler(batchOperation));
    } catch (e) {
      console.log(e);
      dispatch(defaultFailureHandler());
    }
  }

export const batchOperationTags = (formId: string, batchOperation: TActivityBatchOperation) => generalBatchOperationFn(formId, batchOperation, CActivityBatchOperationURL[EActivityBatchOperation.TAGS]);
export const batchOperationStatus = (formId: string, batchOperation: TActivityBatchOperation) => generalBatchOperationFn(formId, batchOperation, CActivityBatchOperationURL[EActivityBatchOperation.STATUS]);