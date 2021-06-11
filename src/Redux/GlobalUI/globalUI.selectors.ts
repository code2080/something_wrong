import { createSelector } from 'reselect';

const globalUIState = (state) => state.globalUI;

export const selectFormDetailTab = createSelector(
  globalUIState,
  (uiState) => uiState.selectedFormDetailTab,
);

export const selectFormDetailSubmission = createSelector(
  globalUIState,
  (uiState) => uiState.selectedFormDetailSubmission,
);

export const selectVisibleColsForDatasourceId = createSelector(
  globalUIState,
  (uiState) => (datasourceId: string) => uiState.tableViews[datasourceId] || {},
);

export const makeSelectSortParamsForActivities = () =>
  createSelector(
    globalUIState,
    (_, formId: string) => formId,
    (uiState, formId) => uiState.activitySorting[formId]?.sortParams || null,
  );
export const makeSelectSortOrderForActivities = () =>
  createSelector(
    globalUIState,
    (_, formId: string) => formId,
    (uiState, formId) => uiState.activitySorting[formId]?.sortOrder || null,
  );
