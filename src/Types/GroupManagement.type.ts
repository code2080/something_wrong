export type TCreateObjectsRequestPayload = {
  numberOfObjects: number;
  typeExtId: string;
  connectTo: {
    typeExtId: string;
    extId: string;
  }
};

export type TRequestSummary = TCreateObjectsRequestPayload & { metadata: { maxTracksForPrimaryObject: number } };

export type TActivityTypeGroup = {
  _id: string;
  activityType: string;
  primaryObject: string;
  track: number;
  totalTracksForActivityType: number;
  maxTracksForPrimaryObject: number;
  activityIds: string[];
};

export const createFn = (obj: any): TActivityTypeGroup => ({
  _id: obj._id,
  activityType: obj.activityType,
  primaryObject: obj.primaryObject,
  track: obj.track,
  totalTracksForActivityType: obj.totalTracksForActivityType,
  maxTracksForPrimaryObject: obj.maxTracksForPrimaryObject,
  activityIds: obj.activityIdsAndTracks.reduce(
    (tot: string[][], acc: any) => {
      // Zero base the track
      const zeroBasedTrack = acc.track - 1;
      // Push the activity id into the right element
      tot[zeroBasedTrack].push(acc.activityId);
      return tot;
    }, 
    Array.from({ length: obj.totalTracksForActivityType }, () => []),
  ),
})