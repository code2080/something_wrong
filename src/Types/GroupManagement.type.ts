import { difference, uniq } from 'lodash';

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
  /**
   * Allocate each activity to an element equivalent to the activity's track - 1 (b/c zero based arrays)
   * Will look as follows:   
   *    TRACK 1     TRACK 2
   * [ [id1, id2],  [id3, id4] ]
   */
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
   * Create the "initial" connect object for the reduction below
   * {
   *   [track#]: string[],
   *   unallocated: string[]
   * }
   */
  const initialVal: Record<string | number, string[]> = {};
  // Create the unallocated objects
  const allExistingObjects = uniq((obj.existingGroupObjects || []).flatMap((val) => val.objects || []));
  const unallocatedObjects = difference(obj.relatedGroupObjects || [], allExistingObjects);
  initialVal.unallocated = unallocatedObjects || [];

  // Create empty arrays for all tracks
  for (let i = 1; i < obj.totalTracksForActivityType; i += 1) {
    initialVal[i] = [];
  }

  // Create connected objects by iterating over all existing objects and add to the right track of initial value
  const connectedObjects = (obj.existingGroupObjects || []).reduce(
    (tot, acc) => ({
      ...tot,
      [acc.track]: [...(tot[acc.track] || []), ...(acc.objects || [])],
    }),
    initialVal,
  );

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
