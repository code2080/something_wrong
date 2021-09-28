import { IndexedObject } from 'Redux/ObjectRequests/ObjectRequests.types';
import { TActivity } from 'Types/Activity.type';
import { Activity } from 'Models/Activity.model';
import { groupBy, keyBy } from 'lodash';
import { getConflictsResolvingStatus } from 'Utils/activities.helpers';

export const SUPPORTED_VALUE_TYPES = ['string', 'number'];
export const MAX_MATCHING_SCORE = 6;

export enum JointTeachingStatus {
  MERGED = 'MERGED',
  NOT_MERGED = 'NOT_MERGED',
  ERROR = 'ERROR',
}

export enum ConflictType {
  TIMING = 'timing',
  VALUES = 'values',
}

export type JointTeachingConflict = {
  _id?: string;
  type: ConflictType;
  extId: string;
  resolution: string[];
};

export type JointTeachingConflictMapping = {
  [type: string]: {
    [extId: string]: JointTeachingConflict;
  };
};

export default class JointTeachingGroup {
  _id: string;
  activities: TActivity[];
  activityIds: string[];
  conflicts: JointTeachingConflict[];
  status: JointTeachingStatus;
  primaryObjects: string[];
  matchingScore: number;
  conflictsMapping: JointTeachingConflictMapping;
  conflictsResolved: boolean;

  constructor({
    _id,
    conflicts = [],
    status = JointTeachingStatus.NOT_MERGED,
    activities,
    activitiesDetail,
    matchingScore,
    primaryObjects,
  }: {
    _id: string;
    activityIds: string[];
    conflicts?: JointTeachingConflict[];
    status?: JointTeachingStatus;
    activities: string[];
    activitiesDetail: IndexedObject[];
    primaryObjects: null | string[];
    matchingScore: number;
    conflictsMapping: {
      [type: string]: {
        [extId: string]: JointTeachingConflict;
      };
    };
  }) {
    this._id = _id;
    this.activityIds = activities;
    this.conflicts = conflicts;
    this.status = status;
    this.activities = activitiesDetail.map((act) => new Activity(act));
    this.primaryObjects =
      primaryObjects || activitiesDetail.map((act) => act.scopedObject);
    this.matchingScore = matchingScore || 0;
    const groupedConflicts = groupBy(conflicts, 'type');
    this.conflictsMapping = Object.keys(groupedConflicts).reduce(
      (results, type) => {
        const conflicts = groupedConflicts[type];
        return {
          ...results,
          [type]: keyBy(conflicts, 'extId'),
        };
      },
      {},
    );
    this.conflictsResolved = getConflictsResolvingStatus(
      this.activities,
      this.conflictsMapping,
    );
  }
}
