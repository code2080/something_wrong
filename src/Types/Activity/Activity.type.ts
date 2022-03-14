import { EActivityStatus } from './ActivityStatus.enum';
import {
  ActivityValue,
  createFn as createActivityValue,
} from './ActivityValue.type';

import {
  TSchedulingError,
  createFn as createSchedulingError,
} from './SchedulingError.type';

export type TActivity = {
  // DESCRIPTIVES
  _id: string;
  organizationId?: string;
  formId: string;
  formInstanceId: string;
  scopedObject?: string;

  // TAGS
  tagId: string | null;

  // DATA
  sectionId: string;
  eventId: string | null;
  sequenceIdx: number | null;
  rowIdx: string | null;
  timing: ActivityValue[]; // An array of ActivityValue, with each element's extId representing one of the properties in the ActivityTiming.model.js
  values: ActivityValue[]; // An array of ActivityValue, with each element's extId representing one of the mapped properties in the form's Activity Designer Mapping

  // SCHEDULING
  activityStatus: EActivityStatus; // The status of the activity, one of the enum values in Constants/activityStatuses.constants.js
  reservationId?: string | null; //  If actvitiyStatus indicates the activity has been scheduled, this prop holds the reservation id
  schedulingTimestamp: string | null; // Timestamp for when the activity was scheduled
  errorDetails?: TSchedulingError; // Instance of scheduling error

  // JOINT TEACHING
  originJointTeachingGroup?: string;
  jointTeaching?: { object: string; typeExtId: string };
  matchedJointTeachingId?: string;
  jointTeachingGroupId?: string;

  // TRACKS
  tracks: number | null;

  // METADATA
  metadata: any;
};

export const createFn = (obj: any): TActivity => ({
  // DESCRIPTIVES
  _id: obj._id,
  organizationId: obj.organizationId,
  formId: obj.formId,
  formInstanceId: obj.formInstanceId,
  scopedObject: obj.scopedObject,

  // TAGS
  tagId: obj.tagId,

  // DATA
  sectionId: obj.sectionId,
  eventId: obj.eventId,
  rowIdx: obj.rowIdx,
  timing: obj.timing,
  values: obj.values.map((obj: any) => createActivityValue(obj)),
  sequenceIdx: obj.sequenceIdx,

  // SCHEDULING
  activityStatus: obj.activityStatus,
  errorDetails: createSchedulingError(obj.errorDetails),
  reservationId: obj.reservationId,
  schedulingTimestamp: obj.schedulingTimestamp || undefined,

  // JOINT TEACHING
  jointTeaching: obj.jointTeaching,
  matchedJointTeachingId: obj.matchedJointTeachingId,
  jointTeachingGroupId: obj.jointTeachingGroupId,
  originJointTeachingGroup: obj.originJointTeachingGroup,

  // TRACKS
  tracks: obj.tracks || undefined,

  // METADATA
  metadata: obj.metadata || {},
});
