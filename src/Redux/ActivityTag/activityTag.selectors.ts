import { createSelector } from 'reselect';
import { TActivityTag } from '../../Types/ActivityTag.type';

const activityTagStateSelector = (state: any) => state.activityTags;

export const selectActivityTagsForForm = createSelector(
  activityTagStateSelector,
  (activityTags) => (formId: string) =>
    activityTags[formId] ? activityTags[formId] : [],
);

export const selectActivityTag = createSelector(
  activityTagStateSelector,
  (activityTags) => (formId: string, activityTagId: string | null) => {
    if (!formId || !activityTagId) return null;
    const activityTagsForForm = activityTags[formId];
    const activityTag = activityTagsForForm.find(
      (el: TActivityTag) => el._id === activityTagId,
    );
    return activityTag;
  },
);
