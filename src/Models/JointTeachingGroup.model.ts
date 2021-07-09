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
  _id?: string;
  activityIds: string[];
  conflicts: JointTeachingConflict[];
  status: JointTeachingStatus;

  constructor({
    _id,
    activityIds,
    conflicts = [],
    status = JointTeachingStatus.NOT_MERGED,
  }: {
    _id?: string;
    activityIds: string[];
    conflicts?: JointTeachingConflict[];
    status?: JointTeachingStatus;
  }) {
    this._id = _id;
    this.activityIds = activityIds;
    this.conflicts = conflicts;
    this.status = status;
  }
}
