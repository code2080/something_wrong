import { ActivityTiming } from './ActivityTiming.model';

export class ActivityDesignerMapping {
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
    this.timing = new ActivityTiming(timing || {});
    this.objects = objects || {};
    this.fields = fields || {};
    this.propSettings = propSettings || {};
  }
}
