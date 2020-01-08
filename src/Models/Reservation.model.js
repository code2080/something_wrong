import { ReservationValue } from './ReservationValue.model';
import moment from 'moment';

export class Reservation {
  _id;

  formId;

  formInstanceId;

  sectionId;

  eventId;

  rowIdx;

  reservationTemplateExtId;

  reservationStatus;

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
    reservationStatus,
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
    this.reservationStatus = reservationStatus;
    this.reservationId = reservationId;
    this.schedulingDate = schedulingDate ? moment.utc(schedulingDate) : null;
    this.timing = timing;
    this.values = values.map(el => new ReservationValue(el));
  }
}
