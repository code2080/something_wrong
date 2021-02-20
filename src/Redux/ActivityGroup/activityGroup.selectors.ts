import { createSelector } from 'reselect';

const activityGroupStateSelector = state => state.activityGroups;

export const selectActivityGroupsForForm = createSelector(
  activityGroupStateSelector,
  activityGroups => (formId: string) => activityGroups[formId]
);

export const selectActivityGroup = createSelector(
  activityGroupStateSelector,
  activityGroups => (formId: string, activityGroupId: string) => activityGroups[formId][activityGroupId]
);
