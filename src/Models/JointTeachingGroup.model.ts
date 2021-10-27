import { IndexedObject } from 'Redux/ObjectRequests/ObjectRequests.types';
import { TActivity } from 'Types/Activity.type';
import { Activity } from 'Models/Activity.model';
import { groupBy, keyBy, uniq } from 'lodash';
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

export type JointTeachingConflictResolution = Array<
  string | number | undefined | null
>;
export type JointTeachingConflict = {
  _id?: string;
  type: ConflictType;
  extId: string;
  resolution: JointTeachingConflictResolution;
};

export type JointTeachingConflictMapping = {
  [type: string]: {
    [extId: string]: JointTeachingConflict;
  };
};

export default class JointTeachingGroup {
  _id: string;
  activities: TActivity[];
  allActivities: TActivity[];
  activityIds: string[];
  conflicts: JointTeachingConflict[];
  status: JointTeachingStatus;
  primaryObjects: string[];
  matchingScore: number;
  matchingOn: { [key: string]: string[] };

  constructor({
    _id,
    conflicts = [],
    status = JointTeachingStatus.NOT_MERGED,
    activities,
    activitiesDetail,
    matchingScore,
    matchingOn,
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
    matchingOn: { [key: string]: string[] };
  }) {
    this._id = _id;
    this.activityIds = activities;
    this.conflicts = conflicts;
    this.status = status;
    this.activities = activitiesDetail.map((act) => new Activity(act));
    // For filtering purpose, should be remove and filter in BE
    this.allActivities = activitiesDetail.map((act) => new Activity(act));
    this.primaryObjects =
      primaryObjects || uniq(activitiesDetail.map((act) => act.scopedObject));
    this.matchingScore = matchingScore || 0;
    this.matchingOn = matchingOn || {};
  }

  /**
   * @description Return new JointTeachingGroup with updated inputs
   * @description To make sure new model can use all the getters
   * @returns new JointTeachingGroup
   */
  private reload(data: {
    [key in keyof JointTeachingGroup]: JointTeachingGroup[keyof JointTeachingGroup];
  }): JointTeachingGroup {
    Object.keys(data).forEach((key) => {
      this[key] = data[key];
    });
    return this;
  }

  /**
   * @description JointTeachingGroup getter, to return conflict mapping
   * @returns JointTeachingConflictMapping
   * @example (new JointTeachingGroup(inputs)).conflictsMapping
   */
  get conflictsMapping(): JointTeachingConflictMapping {
    const groupedConflicts = groupBy(this.conflicts, 'type');
    const conflictsMapping = Object.keys(groupedConflicts).reduce(
      (results, type) => {
        const conflicts = groupedConflicts[type];
        return {
          ...results,
          [type]: keyBy(conflicts, 'extId'),
        };
      },
      {},
    );

    return conflictsMapping;
  }

  /**
   * @description JointTeachingGroup getter, to return if all conflicts are resolved
   * @returns boolean
   * @example (new JointTeachingGroup(inputs)).conflictsResolved
   */
  get conflictsResolved(): boolean {
    return getConflictsResolvingStatus(this.activities, this.conflictsMapping);
  }
}
