import { createSlice } from '@reduxjs/toolkit';
import api from '../../Services/api.service';

// ACTIONS
import {
  finishedLoadingFailure,
  finishedLoadingSuccess,
  beginLoading,
  commitAPIPayloadToState,
} from '../../Utils/sliceHelpers';

// TYPES
import { createFn, TConstraint } from 'Types/Constraint.type';
import { ISimpleAPIResult, ISimpleAPIState, IState } from 'Types/State.type';
import { AppDispatch } from 'Redux/store';

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
  name: 'constraints',
  initialState,
  reducers: {
    defaultRequestHandler: (state) => {
      beginLoading(state);
    },
    defaultFailureHandler: (state) => {
      finishedLoadingFailure(state);
    },
    fetchConstraintsSuccess: (state, { payload }) => {
      commitAPIPayloadToState(payload, state, createFn, 'constraintId');
      finishedLoadingSuccess(state);
    },
  },
});

export default slice.reducer;

// Selectors
export const constraintsSelector = (state: IState): TConstraint[] =>
  state.constraints.results;
export const constraintSelector = (id: string | null | undefined) => (state: IState): TConstraint | undefined =>
    id ? state.constraints.map[id] || undefined : undefined;
export const constraintsLoading = (state: IState): boolean => state.constraints.loading;

// Actions

export const {
  defaultRequestHandler,
  defaultFailureHandler,
  fetchConstraintsSuccess,
} = slice.actions;

export const fetchConstraints = () => async (dispatch: AppDispatch) => {
    try {
      dispatch(defaultRequestHandler());
      const result: ISimpleAPIResult = await api.get({
        endpoint: `constraints`,
      });
      dispatch(fetchConstraintsSuccess(result));
    } catch (e) {
      dispatch(defaultFailureHandler());
    }
  };