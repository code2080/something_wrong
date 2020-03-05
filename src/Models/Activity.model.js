import { ActivityValue } from './ActivityValue.model';
import moment from 'moment';

export class Activity {
  _id;

  formId;

  formInstanceId;

  sectionId;

  eventId;

  rowIdx;

  reservationTemplateExtId;

  activityStatus;

  reservationId;

  schedulingDate;

  timing;

  values;

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
