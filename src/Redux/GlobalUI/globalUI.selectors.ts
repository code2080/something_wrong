import { createSelector } from 'reselect';

const globalUIState = state => state.globalUI;

export const selectFormDetailTab = createSelector(
  globalUIState,
  uiState => uiState.selectedFormDetailTab
);

export const selectFormDetailSubmission = createSelector(
  globalUIState,
  uiState => uiState.selectedFormDetailSubmission,
);