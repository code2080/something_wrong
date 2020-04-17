import { ActvitiyTiming } from './ActivityTiming.model';

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
    this.timing = new ActvitiyTiming(timing || {});
    this.objects = objects || {};
    this.fields = fields || {};
    this.propSettings = propSettings || {};
  }
}
