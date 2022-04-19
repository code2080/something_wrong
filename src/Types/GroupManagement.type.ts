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
   * Logic here is:
   * x) iterate over each element in existingGroupObjects
   * x) add to each track the objects in objects
   */
  const connectedObjects = (obj.existingGroupObjects || []).reduce(
    (tot, acc) => ({
      ...tot,
      [acc.track]: [...(tot[acc.track] || []), ...(acc.objects || [])],
    }),
    {},
  );

  // MOCKED FOR NOW
  // const groupedObjectsByActivityId = groupBy(obj.activityIdsAndTracks, 'track');
  // // const connectedObjects = Object.keys(groupedObjectsByActivityId).reduce((tot, acc) => ({
  // //   ...tot,
  // //   [acc]: groupedObjectsByActivityId[acc],
  // // }), {});
  // const allTracks = Object.keys(groupedObjectsByActivityId);
  // const connectedObjects = allTracks.reduce((tot, acc) => ({
  //   ...tot,
  //   [acc]: Array.from({ length: 3}, (v, idx) => `track_${acc}_${idx}`),
  // }), { 'unallocated': ['u1', 'u2'] });

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
