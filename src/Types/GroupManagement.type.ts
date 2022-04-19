import { difference, uniq } from "lodash";

export enum ECreateObjectsMode {
  SINGLE_GROUP = 'SINGLE_GROUP',
  USE_TRACKS = 'USE_TRACKS',
}

export type TCreateObjectsRequestPayload = {
  numberOfObjects: number;
  typeExtId: string;
  connectTo: {
    typeExtId: string;
    extId: string;
  };
};

export type TRequestSummary = TCreateObjectsRequestPayload & {
  primaryObject: string;
  maxTracksForPrimaryObject: number;
};

export type TActivityTypeTrackGroup = {
  _id: string;
  primaryObject: string;
  activityType: string;
  totalTracksForActivityType: number;
  maxTracksForPrimaryObject: number;
  activityIds: string[][];
  connectedObjects: Record<string, string[]>;
};

type TActivityTypeTrackAPIPayload = {
  _id: string;
  primaryObject: string;
  activityType: string;
  totalTracksForActivityType: number;
  maxTracksForPrimaryObject: number;
  activityIdsAndTracks: { activityId: string; track: number }[];
  existingGroupObjects: { track: number; objects: string[] }[];
  relatedGroupObjects: string[];
};

export const createFn = (
  obj: TActivityTypeTrackAPIPayload,
): TActivityTypeTrackGroup => {
  const activityIds = obj.activityIdsAndTracks.reduce(
    (tot: string[][], acc: any) => {
      // Zero base the track
      const zeroBasedTrack = acc.track - 1;
      // Push the activity id into the right element
      tot[zeroBasedTrack].push(acc.activityId);
      return tot;
    },
    Array.from({ length: obj.totalTracksForActivityType }, () => []),
  );


  /**
   * Create the initial object for the reduction below
   */
  const initialVal: Record<string | number, string[]> = {};
  // Create the unallocated objects
  const allExistingObjects = uniq((obj.existingGroupObjects || []).flatMap((val) => val.objects || []));
  const unallocatedObjects = difference(obj.relatedGroupObjects || [], allExistingObjects);
  console.log({allExistingObjects});
  console.log({unallocatedObjects});
  initialVal.unallocated = unallocatedObjects || [];

  // Create empty arrays for all tracks
  for (let i = 0; i < obj.totalTracksForActivityType; i += 1) {
    initialVal[i+1] = [];
  }

  // Create connected objects by iterating over all existing objects and add to the right track of initial value
  const connectedObjects = (obj.existingGroupObjects || []).reduce((tot, acc) => ({
    ...tot,
    [acc.track]: [ ...(tot[acc.track] || []), ...(acc.objects || []) ],
  }), initialVal);

  return {
    _id: obj._id,
    activityType: obj.activityType,
    primaryObject: obj.primaryObject,
    totalTracksForActivityType: obj.totalTracksForActivityType,
    maxTracksForPrimaryObject: obj.maxTracksForPrimaryObject,
    activityIds,
    connectedObjects,
  };
};
