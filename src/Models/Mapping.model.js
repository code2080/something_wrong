import { Timing } from './Timing.model';

export class ReservationTemplateMapping {
  _id;

  name;

  formId;

  reservationTemplateExtId;

  timing;

  objects;

  fields;

  propSettings;

  constructor({
    _id,
    name,
    formId,
    reservationTemplateExtId,
    timing,
    objects,
    fields,
    propSettings,
  }) {
    this._id = _id;
    this.name = name;
    this.formId = formId;
    this.reservationTemplateExtId = reservationTemplateExtId;
    this.timing = new Timing(timing || {});
    this.objects = objects || {};
    this.fields = fields || {};
    this.propSettings = propSettings || {};
  }
}
