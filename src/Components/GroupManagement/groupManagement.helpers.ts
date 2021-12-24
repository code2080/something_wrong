import { AllocationStatus } from './groupMangement.constants';

export const allocateRelatedObjectsToGroups = ({
  allocationLevel,
  submission,
  relatedObjects,
}: {
  allocationLevel: number;
  submission: any;
  relatedObjects: string[];
}) => {
  if (allocationLevel === 0) {
    return submission.groups
      .filter((group) => relatedObjects.length % group.tracks.length === 0)
      .reduce((results, group) => {
        return {
          ...results,
          ...group.tracks.reduce(
            (groupResults, track, trackIndex) => ({
              ...groupResults,
              [track.id]: relatedObjects.slice(
                (trackIndex * relatedObjects.length) / group.tracks.length,
                ((trackIndex + 1) * relatedObjects.length) /
                  group.tracks.length,
              ),
            }),
            {},
          ),
        };
      }, {});
  }
  return {};
};
export const hasAllocatedActivity = (activities): boolean =>
  activities.some((act) => act.values.some((actVal) => actVal.isAllocated));
export const getSubmissionAllocationStatus = (activities): AllocationStatus => {
  const hasAllocated = hasAllocatedActivity(activities);
  if (!hasAllocated) return 0;
  console.log('activities', activities);
  return activities.some((act) =>
    act.values.some((actVal) => actVal.isAllocated),
  )
    ? 1
    : -1;
};
export const allocateCondition = ({
  allocationLevel,
  submission,
  relatedObjects,
}: {
  allocationLevel: number;
  submission: any;
  relatedObjects: string[];
}) => {
  if (allocationLevel === 0) {
    return submission.groups
      .filter(({ tracks }) => relatedObjects.length % tracks.length === 0)
      .map(({ groupId }) => groupId);
  }
};
