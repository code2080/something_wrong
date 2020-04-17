import { ActivityValue } from './ActivityValue.model';
import moment from 'moment';

/**
 * @class Activity
 * @description the Activity class describes the intermediary state between a form instance and a reservation
 */

export class Activity {
  /**
   * Identification
   */
  _id;

  formId; // The form id the activity was derived from

  formInstanceId; // The form instance id the activity was derived from

  sectionId; // The section id the activity was derived from

  eventId; // The event id the activity was derived from (if section === SECTION_CONNECTED, otherwise null)

  rowIdx; // The row index the activity was derived from (if section === SECTION_TABLE, otherwise null)

  /**
   * Scheduling informationn
   */
  /**
   * @todo remove
   */
  reservationTemplateExtId; // DEPRECATED

  activityStatus; // The status of the activity, one of the enum values in Constants/activityStatuses.constants.js

  reservationId; //  If actvitiyStatus indicates the activity has been scheduled, this prop holds the reservation id

  /**
   * @todo change name to schedulingTimestamp ?
   */
  schedulingDate; // Timestamp for when the activity was scheduled

  /**
   * Timing information
   */
  timing; // An array of ActivityValue, with each element's extId representing one of the properties in the ActivityTiming.model.js

  /**
   * Object and Field values
   */
  values; // An array of ActivityValue, with each element's extId representing one of the mapped properties in the form's ReservationTemplateMapping

  constructor({
    _id,
    formId,
    formInstanceId,
    sectionId,
    eventId,
    rowIdx,
    reservationTemplateExtId,
    activityStatus,
    reservationId,
    schedulingDate,
    timing,
    values
  }) {
    this._id = _id;
    this.formId = formId;
    this.formInstanceId = formInstanceId;
    this.sectionId = sectionId;
    this.eventId = eventId;
    this.rowIdx = rowIdx;
    this.reservationTemplateExtId = reservationTemplateExtId;
    this.activityStatus = activityStatus;
    this.reservationId = reservationId;
    this.schedulingDate = schedulingDate ? moment.utc(schedulingDate) : null;
    this.timing = timing;
    this.values = values.map(el => new ActivityValue(el));
  }
}
