import { ActivityValue } from '../../te-data-models/src/models';
import { EActivityStatus } from './ActivityStatus.enum';

export type TActivity = {
  _id: string;
  formId: string;
  formInstanceId: string;
  groupId: string | null;
  sectionId: string;
  eventId: string;
  rowIdx: string;
  activityStatus: EActivityStatus; // The status of the activity, one of the enum values in Constants/activityStatuses.constants.js
  reservationId: string; //  If actvitiyStatus indicates the activity has been scheduled, this prop holds the reservation id
  schedulingTimestamp: string // Timestamp for when the activity was scheduled
  errorDetails: string; // Instance of scheduling error
  timing: ActivityValue[]; // An array of ActivityValue, with each element's extId representing one of the properties in the ActivityTiming.model.js
  values: ActivityValue[]; // An array of ActivityValue, with each element's extId representing one of the mapped properties in the form's Activity Designer Mapping
}
