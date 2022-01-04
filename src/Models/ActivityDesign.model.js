import { ActivityTiming } from './ActivityTiming.model';

export class ActivityDesign {
  name;
  formId;
  timing;
  objects;
  fields;
  propSettings;
  isEditable;
  additionalFields;

  constructor({
    name,
    formId,
    timing,
    objects,
    fields,
    propSettings,
    isEditable,
    hasTiming,
    useTimeslots,
    additionalFields,
  }) {
    this.name = name;
    this.formId = formId;
    this.timing = new ActivityTiming(timing || {}, { useTimeslots, hasTiming });
    this.objects = objects || {};
    this.fields = fields || {};
    this.propSettings = propSettings || {};
    this.isEditable = isEditable || false;
    this.additionalFields = additionalFields;
  }
}
