import { createSlice } from '@reduxjs/toolkit';
import api from '../../Services/api.service';

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
import { ISimpleAPIResult, ISimpleAPIState, IState } from 'Types/State.type';
import { AppDispatch } from 'Redux/store';
import { omit } from 'lodash';

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
  name: 'constraintProfiles',
  initialState,
  reducers: {
    defaultRequestHandler: (state) => {
      beginLoading(state);
    },
    defaultFailureHandler: (state) => {
      finishedLoadingFailure(state);
    },
    fetchConstraintProfilesForFormSuccess: (state, { payload }) => {
      commitAPIPayloadToState(payload, state, createFn);
      finishedLoadingSuccess(state);
    },
    createConstraintProfileForFormSuccess: (state, { payload }) => {
      upsertEntity(state, payload, createFn);
      finishedLoadingSuccess(state);
    },
    updateConstraintProfileForFormSuccess: (state, { payload }) => {
      upsertEntity(state, payload, createFn);
      finishedLoadingSuccess(state);
    },
    deleteConstraintProfileForFormSuccess: (state, { payload }) => {
      deleteEntityFromState(payload, state);
      finishedLoadingSuccess(state);
    },
  },
});

export default slice.reducer;

// Selectors
export const constraintProfilesSelector = (state: IState): TConstraintProfile[] =>
  state.constraintProfiles.results;
export const constraintProfileSelector = (id: string | null | undefined) => (state: IState): TConstraintProfile | undefined =>
    id ? state.constraintProfiles.map[id] || undefined : undefined;
export const constraintProfilesLoading = (state: IState): boolean => state.constraintProfiles.loading;

// Actions

export const {
  defaultRequestHandler,
  defaultFailureHandler,
  fetchConstraintProfilesForFormSuccess,
  createConstraintProfileForFormSuccess,
  updateConstraintProfileForFormSuccess,
  deleteConstraintProfileForFormSuccess,
} = slice.actions;

export const fetchConstraintProfilesForForm =
  (formId: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(defaultRequestHandler());
      const result: ISimpleAPIResult = await api.get({
        endpoint: `forms/${formId}/constraint-profiles`,
      });
      dispatch(fetchConstraintProfilesForFormSuccess(result));
    } catch (e) {
      dispatch(defaultFailureHandler());
    }
  };

export const createConstraintProfile =
  (formId: string, body: Partial<TConstraintProfile>) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(defaultRequestHandler());
      const result = await api.post({
        endpoint: `forms/${formId}/constraint-profiles`,
        data: body,
      });
      dispatch(createConstraintProfileForFormSuccess(result));
    } catch (e) {
      dispatch(defaultFailureHandler());
    }
  };

export const updateConstraintProfile =
  (formId: string, body: TConstraintProfile) => async (dispatch: any) => {
    try {
      dispatch(defaultRequestHandler());
      const safePayload = omit(body, ['_id', 'formId']);
      console.log(safePayload);
      const result = await api.patch({
        endpoint: `forms/${formId}/constraint-profiles/${body._id}`,
        data: safePayload,
      });
      dispatch(updateConstraintProfileForFormSuccess(result));
    } catch (e) {
      dispatch(defaultFailureHandler());
    }
  };

export const deleteConstraintProfileForForm =
  (formId: string, id: string) => async (dispatch: any) => {
    try {
      dispatch(defaultRequestHandler());
      await api.delete({
        endpoint: `forms/${formId}/constraint-profiles/${id}`,
      });
      dispatch(deleteConstraintProfileForFormSuccess(id));
    } catch (e) {
      dispatch(defaultFailureHandler());
    }
  };

