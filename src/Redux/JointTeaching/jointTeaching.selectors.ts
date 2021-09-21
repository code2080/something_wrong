import { MATCHED_ACTIVITIES_TABLE } from 'Constants/tables.constants';
import { flatten, isEmpty } from 'lodash';
import { createSelector } from 'reselect';

const stateSelector = (state) => state.jointTeaching;
const activityStateSelector = (state) => state.activities;

export const selectJointTeachingGroupsForForm = (formId: string) =>
  createSelector(
    stateSelector,
    activityStateSelector,
    (jointTeaching, activity) => {
      const groups = jointTeaching.groups[formId] || [];
      const activities = activity[`${formId}${MATCHED_ACTIVITIES_TABLE}`];
      if (!activities) return groups;
      const allFilteredActivities = flatten(Object.values(activities)).map(
        (act: any) => act._id,
      );
      const _groups = groups.map((group) => {
        return {
          ...group,
          activities: group.activities.filter((activity) =>
            allFilteredActivities.includes(activity._id),
          ),
        };
      });
      return _groups.filter((group) => !isEmpty(group.activities));
    },
  );
