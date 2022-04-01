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
import { error } from 'console';

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
  name: 'constraintConfigurations',
  initialState,
  reducers: {
    defaultRequestHandler: (state) => {
      beginLoading(state);
    },
    defaultFailureHandler: (state) => {
      finishedLoadingFailure(state);
    },
    fetchConstraintConfigurationsForFormSuccess: (state, { payload }) => {
      commitAPIPayloadToState(payload, state, createFn);
      finishedLoadingSuccess(state);
    },
    createConstraintConfigurationsForFormSuccess: (state, { payload }) => {
      upsertEntity(state, payload, createFn);
      finishedLoadingSuccess(state);
    },
    updateConstraintConfigurationsForFormSuccess: (state, { payload }) => {
      upsertEntity(state, payload, createFn);
      finishedLoadingSuccess(state);
    },
    deleteConstraintConfigurationsForFormSuccess: (state, { payload }) => {
      deleteEntityFromState(payload, state);
      finishedLoadingSuccess(state);
    },
  },
});

export default slice.reducer;

// Selectors
export const selectConstraintConfigurations = (state: IState) =>
  state.constraintConfigurations.results;

export const selectConstraintConfigurationsLoading = (state: IState) =>
  state.constraintConfigurations.loading;

// todo: select single config
// export const selectActiveConstraintConfigurationForForm=(id:string)=>(state:IState)=>state.constraintConfigurations.

// Actions

export const {
  defaultRequestHandler,
  defaultFailureHandler,
  fetchConstraintConfigurationsForFormSuccess,
  createConstraintConfigurationsForFormSuccess,
  updateConstraintConfigurationsForFormSuccess,
  deleteConstraintConfigurationsForFormSuccess,
} = slice.actions;

export const fetchConstraintConfigurationsForForm =
  (formId: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(defaultRequestHandler());
      const result: ISimpleAPIResult = await api.get({
        endpoint: `forms/${formId}/constraint-configurations`,
      });
      dispatch(fetchConstraintConfigurationsForFormSuccess(result));
    } catch (e) {
      dispatch(defaultFailureHandler());
    }
  };

export const createConstraintConfigurationForForm =
  (formId: string, tagBody: Omit<TConstraintProfile, '_id' | 'formId'>) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(defaultRequestHandler());
      const result = await api.post({
        endpoint: `forms/${formId}/constraint-configurations`,
        data: tagBody,
      });
      dispatch(createConstraintConfigurationsForFormSuccess(result));
    } catch (e) {
      dispatch(defaultFailureHandler());
    }
  };

/* export const updateTagForForm =
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
 */
