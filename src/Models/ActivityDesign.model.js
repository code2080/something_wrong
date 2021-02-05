import { ActivityTiming } from './ActivityTiming.model';

export class ActivityDesign {
  name;
  formId;
  timing;
  objects;
  fields;
  propSettings;

  constructor({
    name,
    formId,
    timing,
    objects,
    fields,
    propSettings,
  }) {
    this.name = name;
    this.formId = formId;
    this.timing = new ActivityTiming(timing || {});
    this.objects = objects || {};
    this.fields = fields || {};
    this.propSettings = propSettings || {};
  }
}
