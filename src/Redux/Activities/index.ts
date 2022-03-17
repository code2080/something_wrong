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

// SELECTORS
import { selectAllLabels } from 'Redux/TE/te.selectors';
import { tagsSelector } from 'Redux/Tags';
import { selectAllRecipientsFromSubmissionFromForm } from 'Redux/FormSubmissions/formSubmissions.selectors';
import {
  selectFieldLabelsMapping,
  selectObjectLabelsMapping,
} from 'Redux/Integration/integration.selectors';

// UTILS
import { serializeSSPQuery } from 'Components/SSP/Utils/helpers';
import { extractValuesFromActivityValues } from 'Utils/activities.helpers';

// TYPES
import { createFn, TActivity } from 'Types/Activity/Activity.type';
import {
  createFn as createActivityFilterLookupMap,
  TActivityFilterLookupMap,
} from 'Types/Activity/ActivityFilterLookupMap.type';
import {
  ISSPReducerState,
  ISSPQueryObject,
  EFilterType,
  EFilterInclusions,
} from 'Types/SSP.type';
import { IState } from 'Types/State.type';
import { TActivityTag } from 'Types/ActivityTag.type';
import { EActivityStatus } from 'Types/Activity/ActivityStatus.enum';
import {
  CActivityBatchOperationURL,
  EActivityBatchOperation,
  TActivityBatchOperation,
} from 'Types/Activity/ActivityBatchOperations.type';
import { TForm } from 'Types/Form.type';
import { TPopulateSelectionPayload } from 'Types/TECorePayloads.type';
import { ActivityValue } from 'Types/Activity/ActivityValue.type';
import { EActivityGroupings } from 'Types/Activity/ActivityGroupings.enum';
import { merge } from 'lodash';

export const initialState: ISSPReducerState = {
  // API STATE
  loading: false,
  hasErrors: false,
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
    [EActivityGroupings.WEEK_PATTERN]: {
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
    fullSubmission: false,
    jointTeaching: EFilterInclusions.INCLUDE,
  },
  filters: {},
  filterLookupMap: {},
};

// Slice
const slice = createSlice({
  name: 'activities',
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
      state.filterLookupMap = merge(state.filterLookupMap || {}, lookupMap);
      // finishedLoadingSuccess(state); @todo break out into separate loading component
    },
    patchFilterLookupMapWithLocalState: (state, { payload }) => {
      const keysToMerge = Object.keys(payload);
      for (let i = 0; i < keysToMerge.length; i += 1) {
        const currFilterLookupMapPropValues: any[] =
          state.filterLookupMap[keysToMerge[i]];
        const newLocalStateVals = payload[keysToMerge[i]];
        const newValues = {
          ...currFilterLookupMapPropValues,
          ...newLocalStateVals,
        };
        state.filterLookupMap[keysToMerge[i]] = newValues;
      }
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
  state.activities.data[state.activities.groupBy].results;
export const activitySelector =
  (id: string) =>
  (state: IState): TActivity | undefined =>
    state.activities.data[state.activities.groupBy][id] || undefined;
export const activitiesLoading = (state: IState): boolean =>
  state.activities.loading;
export const activityFilterLookupMapSelector = (
  state: IState,
): TActivityFilterLookupMap => state.activities.filterLookupMap;

/**
 * ALWAYS use this selector in case you're planning on using the map for filtering
 * It executes various convenience functions against the raw map before returning it
 */
export const selectLookupMapForFiltering = (
  state: IState,
): TActivityFilterLookupMap => {
  // Get the raw map from state
  const rawMap = state.activities.filterLookupMap;
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

export const selectTECPayloadForActivity =
  (id: string) =>
  (state: IState): TPopulateSelectionPayload | undefined => {
    /**
     * This is an error prone function given all the selectors and data needed
     * Wrapped in a try catch to stop the page from breaking if we're in a race conidition sitch
     * where we've fetched activities before forms or submissions
     */

    /**
     * @todo update to work with object requests - see APP 734
     */
    try {
      // Get the activity
      const activity = state.activities.data[state.activities.groupBy].map[id];

      // Get the form
      const form = state.forms[activity.formId] as TForm;

      // Extract the activity values
      const valuePayload = extractValuesFromActivityValues(
        activity.values || [],
      );

      // Include the following 3 vars for 734 (or alter them to work)

      // Get the form instance
      /*       const formInstance =
        state.submissions[activity.formId]?.mapped?.byId[
          activity.formInstanceId
        ]; */

      // Get the object requests
      /*       const objectRequests = selectFormInstanceObjectRequests(formInstance)(
        // todo: fix this type
        state as never,
      ); */

      /*       const withObjReqs = hydrateObjectRequestsFromValuePayload(
        valuePayload,
        objectRequests,
      );  */

      return {
        ...valuePayload,
        reservationMode: form.reservationMode,
        formType: form.formType as 'REGULAR' | 'AVAILABILITY',
        startTime: activity.timing.find(
          (act: ActivityValue) => act?.extId === 'startTime',
        )?.value,
        endTime: activity.timing.find(
          (act: ActivityValue) => act?.extId === 'endTime',
        )?.value,
      };
    } catch (error) {
      return undefined;
    }
  };

// Actions
export const {
  defaultRequestHandler,
  defaultFailureHandler,
  initializeSSPStateProps,
  fetchActivitiesForFormSuccess,
  fetchActivityFilterLookupMapSuccess,
  defaultBatchOperationSuccessHandler,
  patchFilterLookupMapWithLocalState,
} = slice.actions;

export const fetchActivitiesForForm =
  (formId: string, queryObject?: Partial<ISSPQueryObject>) =>
  async (dispatch: any, getState: () => IState) => {
    try {
      const serializedQuery = serializeSSPQuery(
        queryObject,
        getState().activities,
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

const generalBatchOperationFn =
  (formId: string, batchOperation: TActivityBatchOperation, boUrl: string) =>
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
  };

export const batchOperationTags = (
  formId: string,
  batchOperation: TActivityBatchOperation,
) =>
  generalBatchOperationFn(
    formId,
    batchOperation,
    CActivityBatchOperationURL[EActivityBatchOperation.TAGS],
  );
export const batchOperationStatus = (
  formId: string,
  batchOperation: TActivityBatchOperation,
) =>
  generalBatchOperationFn(
    formId,
    batchOperation,
    CActivityBatchOperationURL[EActivityBatchOperation.STATUS],
  );
