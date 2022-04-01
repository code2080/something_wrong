import { createSlice } from '@reduxjs/toolkit';
import api from '../../Services/api.service';
import { omit } from 'lodash';

// ACTIONS
import {
  finishedLoadingFailure,
  finishedLoadingSuccess,
  beginLoading,
  commitAPIPayloadToState,
  upsertEntity,
  deleteEntityFromState,
} from '../../Utils/sliceHelpers';

// TYPES
import { createFn, TConstraintProfile } from 'Types/ConstraintProfile.type';
import { ISimpleAPIState, IState } from 'Types/State.type';

export const initialState: ISimpleAPIState = {
  // API STATE
  loading: false,
  hasErrors: false,
  // DATA
  results: [],
  map: {},
};

// Slice
const slice = createSlice({
  name: 'tags',
  initialState,
  reducers: {
    defaultRequestHandler: (state) => {
      beginLoading(state);
    },
    defaultFailureHandler: (state) => {
      finishedLoadingFailure(state);
    },
    fetchTagsForFormSuccess: (state, { payload }) => {
      commitAPIPayloadToState(payload, state, createFn);
      finishedLoadingSuccess(state);
    },
    createTagForFormSuccess: (state, { payload }) => {
      upsertEntity(state, payload, createFn);
      finishedLoadingSuccess(state);
    },
    updateTagForFormSuccess: (state, { payload }) => {
      upsertEntity(state, payload, createFn);
      finishedLoadingSuccess(state);
    },
    deleteTagForFormSuccess: (state, { payload }) => {
      deleteEntityFromState(payload, state);
      finishedLoadingSuccess(state);
    },
  },
});

export default slice.reducer;

// Selectors
export const tagsSelector = (state: IState): TActivityTag[] =>
  state.tags.results;
export const tagSelector =
  (id: string | null | undefined) =>
  (state: IState): TActivityTag | undefined =>
    id ? state.tags.map[id] || undefined : undefined;
export const tagsLoading = (state: IState): boolean => state.tags.loading;

// Actions
export const {
  defaultRequestHandler,
  defaultFailureHandler,
  fetchTagsForFormSuccess,
  createTagForFormSuccess,
  updateTagForFormSuccess,
  deleteTagForFormSuccess,
} = slice.actions;

export const fetchTagsForForm = (formId: string) => async (dispatch: any) => {
  try {
    dispatch(defaultRequestHandler());
    const result = await api.get({ endpoint: `forms/${formId}/tags` });
    dispatch(fetchTagsForFormSuccess(result));
  } catch (e) {
    dispatch(defaultFailureHandler());
  }
};

export const createTagForForm =
  (formId: string, tagBody: Omit<TActivityTag, '_id' | 'formId'>) =>
  async (dispatch: any) => {
    try {
      dispatch(defaultRequestHandler());
      const result = await api.post({
        endpoint: `forms/${formId}/tags`,
        data: tagBody,
      });
      dispatch(createTagForFormSuccess(result));
    } catch (e) {
      dispatch(defaultFailureHandler());
    }
  };

export const updateTagForForm =
  (formId: string, tagBody: TActivityTag) => async (dispatch: any) => {
    try {
      dispatch(defaultRequestHandler());
      const safePayload = omit(tagBody, ['_id', 'formId']);
      const result = await api.patch({
        endpoint: `forms/${formId}/tags/${tagBody._id}`,
        data: safePayload,
      });
      dispatch(updateTagForFormSuccess(result));
    } catch (e) {
      dispatch(defaultFailureHandler());
    }
  };

export const deleteTagForForm =
  (formId: string, tagId: string) => async (dispatch: any) => {
    try {
      dispatch(defaultRequestHandler());
      const result = await api.delete({
        endpoint: `forms/${formId}/tags/${tagId}`,
      });
      dispatch(deleteTagForFormSuccess(result));
    } catch (e) {
      dispatch(defaultFailureHandler());
    }
  };
