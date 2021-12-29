import { AllocationStatus } from './groupMangement.constants';

export type AllocatedObject = {
  [rowIdxOrEventId: string]: string | null | undefined;
};

export const allocateRelatedObjectsToGroups = ({
  allocationLevel,
  submission,
  relatedObjects,
}: {
  allocationLevel: number;
  submission: any;
  relatedObjects: string[];
}): AllocatedObject => {
  if (allocationLevel === 0) {
    return (
      submission.groups
        // Only allocate for the group which divisible by relatedObjects
        .filter(
          (group) => relatedObjects.length % group.activities.length === 0,
        )
        .reduce((results, group) => {
          return {
            ...results,
            ...group.activities.reduce(
              (groupResults, act, trackIndex) => ({
                ...groupResults,
                [act.rowIdx || act.eventId]: relatedObjects.slice(
                  (trackIndex * relatedObjects.length) /
                    group.activities.length,
                  ((trackIndex + 1) * relatedObjects.length) /
                    group.activities.length,
                ),
              }),
              {},
            ),
          };
        }, {})
    );
  }

  // The logic if difference for another level
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
