import { Timing } from './Timing.model';

export class ReservationTemplateMapping {
  name;

  formId;

  timing;

  objects;

  fields;

  propSettings;

  constructor({
    name,
    formId,
    reservationTemplateExtId,
    timing,
    objects,
    fields,
    propSettings,
  }) {
    this.name = name;
    this.formId = formId;
    this.reservationTemplateExtId = reservationTemplateExtId;
    this.timing = new Timing(timing || {});
    this.objects = objects || {};
    this.fields = fields || {};
    this.propSettings = propSettings || {};
  }
}
