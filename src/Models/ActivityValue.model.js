/**
 * @class ActivityValue
 * @description the ActivityValue class holds the main payload for an object of the Activity class
 */

export class ActivityValue {
  _id; // The id

  type; // The activity value type, an enum of Constants/activityValueTypes.constants.js

  extId; // The extId property this represents on a reservation, as described in the forms Activity Designer Mapping

  submissionValue; // The original submission value, always stored as 0 -> n elements in an array

  /**
   * The type of submission value, partly a result of the ActivityValue.type, but also a result of the element type chosen in the form
   * One of
   * a) OBJECT (only when type === activityValueTypes.object)
   * b) FREE_TEXT (only when type === activityValueTypes.field)
   * c) TIMING (only when type === activityValueTypes.timing)
   * d) FILTER (theoretically possible for both type === object || field)
   */
  submissionValueType;

  /**
   * The way in which the value has been derived;
   * One of the enums described in Constants/activityValueModes; either MANUAL or FROM_SUBMSSION
   */
  valueMode;

  /**
   * The derived value, either what we had in the form submission (if value mode === FROM SUBMISSION)
   * or a manual override (if value mode === MANUAL)
   */
  value;

  /**
   * IDENTIFYING INFO
   */
  sectionId; // The section this activity value is from

  elementId; // The element this activity value is from

  eventId; // The event this activity value is from (if section === SECTION_CONNECTED, otherwise null)

  rowIdx; // The row this activity value is from (if section === SECTION_TABLE, otherwise null)

  constructor({
    _id,
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
    this._id = _id;
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
