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
    (uiState, formId) =>
      uiState.activitySorting[formId]?.activityTable?.sortParams || null,
  );
export const makeSelectSortOrderForActivities = () =>
  createSelector(
    globalUIState,
    (_, formId: string) => formId,
    (uiState, formId) =>
      uiState.activitySorting[formId]?.activityTable?.sortOrder || null,
  );

export const makeSelectSortParamsForJointTeaching = () =>
  createSelector(
    globalUIState,
    (_, formId: string) => formId,
    (uiState, formId) =>
      uiState.activitySorting[formId]?.jointTeachingTable?.sortParams || null,
  );
export const makeSelectSortOrderForJointTeaching = () =>
  createSelector(
    globalUIState,
    (_, formId: string) => formId,
    (uiState, formId) =>
      uiState.activitySorting[formId]?.jointTeachingTable?.sortOrder || null,
  );
export const selectUnmatchedActivities = (formId: string) =>
  createSelector(
    globalUIState,
    (globalUI) => globalUI.jointTeaching?.[formId]?.activities || [],
  );
