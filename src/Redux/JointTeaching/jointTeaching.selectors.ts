// import { flatten, isEmpty } from 'lodash';
import { createSelector } from 'reselect';

const stateSelector = (state) => state.jointTeaching;
const activityStateSelector = (state) => state.activities;

export const selectJointTeachingGroupsForForm = (formId: string) =>
  createSelector(stateSelector, activityStateSelector, (jointTeaching) => {
    const groups = jointTeaching.groups[formId] ?? [];
    // TODO: Do not filter JT matches by filtered activities
    // const activities = activity[`${formId}${MATCHED_ACTIVITIES_TABLE}`];
    // if (!activities) return groups;
    // const allFilteredActivities = flatten(Object.values(activities)).map(
    //   (act: any) => act._id,
    // );
    // const _groups = groups.map((group) => {
    //   return group.reload({
    //     ...group,
    //     activities: group.allActivities.filter((activity) =>
    //       allFilteredActivities.includes(activity._id),
    //     ),
    //   });
    // });
    // return _groups.filter((group) => !isEmpty(group.activities));
    return groups;
  });

export const selectJointTeachingGroupById = ({
  formId,
  jointTeachingGroupId,
}) =>
  createSelector(stateSelector, (jointTeaching) => {
    return jointTeaching[formId]?.find(
      (group) => group._id === jointTeachingGroupId,
    );
  });
