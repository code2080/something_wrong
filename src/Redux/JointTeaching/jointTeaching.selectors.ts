import { flatten, isEmpty } from 'lodash';
import JointTeachingGroup from 'Models/JointTeachingGroup.model';
import { createSelector } from 'reselect';
import { TActivity } from 'Types/Activity.type';

const stateSelector = (state) => state.jointTeaching;
const activityStateSelector = (state) => state.activities;

export const selectJointTeachingGroupsForForm = (formId: string) =>
  createSelector(
    stateSelector,
    activityStateSelector,
    (jointTeaching, activity) => {
      const groups = jointTeaching.groups[formId] || [];
      const activities = activity?.matchedActivities?.[formId];
      if (!activities) return groups;
      const allFilteredActivities = flatten(Object.values(activities)).map(
        (act: TActivity) => act._id,
      );
      const _groups = groups.map((group) => {
        return {
          ...group,
          activities: group.activities.filter((activity) =>
            allFilteredActivities.includes(activity._id),
          ),
        };
      });
      console.log('_groups', _groups);
      return _groups.filter((group) => !isEmpty(group.activities));
    },
  );
