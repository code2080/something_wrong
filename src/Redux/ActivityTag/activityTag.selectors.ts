import { createSelector } from 'reselect';
import { TActivityTag } from '../../Types/ActivityTag.type';
import { IState } from '../../Types/State.type';

const activityTagStateSelector = (state: any) => state.activityTags;

export const selectTagsByFormId = (formId: string) => (state: IState) =>
  state.activityTags[formId] || [];

export const selectActivityTagsForForm = createSelector(
  activityTagStateSelector,
  (activityTags) => (formId: string) => activityTags[formId] ?? [],
);

export const selectActivityTag = createSelector(
  activityTagStateSelector,
  (activityTags) =>
    (formId: string, activityTagId: string | null): TActivityTag | null => {
      if (!formId || !activityTagId) return null;
      const activityTagsForForm = (activityTags[formId] ??
        []) as TActivityTag[];
      return (
        activityTagsForForm.find((tag) => tag._id === activityTagId) || null
      );
    },
);
