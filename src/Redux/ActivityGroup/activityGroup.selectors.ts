import { createSelector } from 'reselect';
import { TActivityGroup } from '../../Types/ActivityGroup.type';

const activityGroupStateSelector = (state: any) => state.activityGroups;

export const selectActivityGroupsForForm = createSelector(
  activityGroupStateSelector,
  (activityGroups) => (formId: string) =>
    activityGroups[formId] ? activityGroups[formId] : [],
);

export const selectActivityGroup = createSelector(
  activityGroupStateSelector,
  (activityGroups) => (formId: string, activityGroupId: string | null) => {
    if (!formId || !activityGroupId) return null;
    const activityGroupsForForm = activityGroups[formId];
    const activityGroup = activityGroupsForForm.find(
      (el: TActivityGroup) => el._id === activityGroupId,
    );
    return activityGroup;
  },
);
