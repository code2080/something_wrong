import { IndexedObject } from 'Redux/ObjectRequests/ObjectRequests.types';
import { TActivity } from 'Types/Activity.type';
import { Activity } from 'Models/Activity.model';

export const MAX_MATCHING_SCORE = 6;

export enum JointTeachingStatus {
  MERGED = 'MERGED',
  NOT_MERGED = 'NOT_MERGED',
  ERROR = 'ERROR',
}

export enum ConflictType {
  TIMING,
  VALUES,
}

export type JointTeachingConflict = {
  type: ConflictType;
  extId: string;
  resolution: string[];
  status: JointTeachingStatus;
};

export default class JointTeachingGroup {
  _id: string;
  activities: TActivity[];
  activityIds: string[];
  conflicts: JointTeachingConflict[];
  status: JointTeachingStatus;
  primaryObjects: string[];
  matchingScore: number;

  constructor({
    _id,
    conflicts = [],
    status = JointTeachingStatus.NOT_MERGED,
    activities,
    activitiesDetail,
    matchingScore,
  }: {
    _id: string;
    activityIds: string[];
    conflicts?: JointTeachingConflict[];
    status?: JointTeachingStatus;
    activities: string[];
    activitiesDetail: IndexedObject[];
    matchingScore: number;
  }) {
    this._id = _id;
    this.activityIds = activities;
    this.conflicts = conflicts;
    this.status = status;
    this.activities = activitiesDetail.map((act) => new Activity(act));
    this.primaryObjects = [];
    this.matchingScore = matchingScore || 0;
  }
}
