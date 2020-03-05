export class ActivityValue {
  type;

  extId;

  submissionValue;

  submissionValueType;

  valueMode;

  value;

  sectionId;

  elementId;

  eventId;

  rowIdx;

  constructor({
    type,
    extId,
    submissionValue,
    submissionValueType,
    valueMode,
    value,
    sectionId,
    elementId,
    eventId,
    rowIdx,
  }) {
    this.type = type;
    this.extId = extId;
    this.value = value;
    this.submissionValue = submissionValue;
    this.submissionValueType = submissionValueType;
    this.valueMode = valueMode;
    this.sectionId = sectionId;
    this.elementId = elementId;
    this.eventId = eventId;
    this.rowIdx = rowIdx;
  }
}
