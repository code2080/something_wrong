// HELPERS
import { getSectionFromId, getElementFromSection, getSectionTypeFromId } from './sections.helpers';

// MODELS
import { ActivityValue } from '../Models/ActivityValue.model';

// CONSTANTS
import { activityValueTypeProps, activityValueTypes } from '../Constants/activityValueTypes.constants';
import { mappingTimingModes } from '../Constants/mappingTimingModes.constants';
import {
  SECTION_TABLE,
  SECTION_CONNECTED
} from '../Constants/sectionTypes.constants';
import { submissionValueTypes } from '../Constants/submissionValueTypes.constants';
import { activityValueModes } from '../Constants/activityValueModes.constants';

/**
 * @function ensureValueIsArray
 * @description ensure's a value is an array
 * @param {Any} value the value to check
 * @returns {Array} an array formatted value
 */
const ensureValueIsArray = value => {
  if (Array.isArray(value)) return value;
  return [value];
};

/**
 * @function formatActivityPayload
 * @description general purpose function to format the result of an activity payload generator for one of the section types
 * @param {*} element the element the value was for
 * @param {*} rawValue the raw submission value
 * @returns {Object} activityValuePayload
 */
const formatActivityPayload = (element, rawValue) => {
  const _rawValue = ensureValueIsArray(rawValue);
  const _defPayload = {
    submissionValue: _rawValue,
    submissionValueType: submissionValueTypes.FREE_TEXT,
    valueMode: activityValueModes.FROM_SUBMISSION,
    value: _rawValue[0],
  };
  // IF no datasource we interpret the value as is
  if (!element.datasource)
    return _defPayload
  // Split the data source to get its components
  const datasource = element.datasource.split(',');
  // If data source doesn't match format, return def value payload
  if (!datasource.length || datasource.length < 2)
    return _defPayload;
  // If datasource[1] === 'object'
  if (datasource[1] === 'object')
    return { ..._defPayload, submissionValueType: submissionValueTypes.OBJECT };
  return {
    submissionValue: [{ field: datasource[1], value: rawValue }],
    submissionValueType: submissionValueTypes.FILTER,
    valueMode: activityValueModes.FROM_SUBMISSION,
    value: null,
  };
};

/**
 * @function getActivityValuePayloadFromConnectedSection
 * @description extracts the base payload for an activity value for a connected section
 * @param {Object} formInstance the form instance
 * @param {String} sectionId the section id
 * @param {String} eventId the event id
 * @param {String} elementId the element id
 * @param {Array} sections all sections in the form
 */
const getActivityValuePayloadFromConnectedSection = (formInstance, sectionId, eventId, elementId, sections) => {
  if (!formInstance || !sectionId || !eventId || !elementId || !sections) return null;
  const section = getSectionFromId(sectionId, sections);
  if (!section) return null;
  const eventValues = formInstance.values[sectionId][eventId].values;
  if (!eventValues) return null;
  const elementIdx = eventValues.findIndex(el => el.elementId === elementId);
  if (elementIdx === -1) return null;
  const rawValue = eventValues[elementIdx].value;
  const element = getElementFromSection(elementId, section);
  if (!element) return null;
  return formatActivityPayload(element, rawValue);
};

/**
 * @function getActivityValuePayloadFromTableSection
 * @description extracts the base payload for an activity value for a table section
 * @param {Object} formInstance the form instance
 * @param {String} sectionId the section id
 * @param {String} rowIdx the table row
 * @param {String} elementId the element id
 * @param {Array} sections all sections in the form
 */
const getActivityValuePayloadFromTableSection = (formInstance, sectionId, rowIdx, elementId, sections) => {
  if (!formInstance || !sectionId || !rowIdx || !elementId || !sections) return null;
  const section = getSectionFromId(sectionId, sections);
  if (!section) return null;
  const rowValues = formInstance.values[sectionId][rowIdx];
  if (!rowValues) return null;
  const elementIdx = rowValues.findIndex(el => el.elementId === elementId);
  if (elementIdx === -1) return null;
  const rawValue = rowValues[elementIdx].value.toString();
  const element = getElementFromSection(elementId, section);
  if (!element) return null;
  return formatActivityPayload(element, rawValue);
};

/**
 * @function getActivityValuePayloadFromRegularSection
 * @description extracts the base payload for an activity value for a regular section
 * @param {Object} formInstance the form instance
 * @param {String} sectionId the section id
 * @param {String} elementId the element id
 * @param {Array} sections all sections in the form
 */

const getActivityValuePayloadFromRegularSection = (formInstance, sectionId, elementId, sections) => {
  if (!formInstance || !sectionId || !elementId || !sections) return null;
  const section = getSectionFromId(sectionId, sections);
  if (!section) return null;
  const sectionValues = formInstance.values[sectionId];
  if (!sectionValues) return null;
  const elementIdx = sectionValues.findIndex(el => el.elementId === elementId);
  if (elementIdx === -1) return null;
  const rawValue = sectionValues[elementIdx].value.toString();
  const element = getElementFromSection(elementId, section);
  if (!element) return null;
  return formatActivityPayload(element, rawValue);
};

/**
 * @function getEventValue
 * @description gets the value of an element or property in an event in a connected section in a form instance
 * @param {String} prop the element or property
 * @param {Object} formInstance the form instance
 * @param {String} sectionId the connected section's id
 * @param {String} eventId the event id
 * @returns {Any} eventValue
 */
const getEventValue = (prop, formInstance, sectionId, eventId) => formInstance.values[sectionId][eventId][prop];

/**
 * @function getScopedObjectValue
 * @description gets the extId of the scoped object for a form instance
 * @param {Object} formInstance the form instance to fetch the value from
 * @returns {String} scopedObjectExtId
 */
const getScopedObjectValue = formInstance => formInstance.scopedObject;

/**
 * @function createTimingModeActivityValue
 * @description special case helper for creating the activity value for the TIMING.mode mapping parameter
 * @param {String} selectedTimingMode the chosen timing mode
 */
const createTimingModeActivityValue = selectedTimingMode => new ActivityValue({
  type: activityValueTypes.TIMING,
  extId: 'mode',
  submissionValue: [selectedTimingMode],
  submissionValueType: submissionValueTypes.TIMING,
  valueMode: activityValueModes.FROM_SUBMISSION,
  value: selectedTimingMode,
  sectionId: null,
  elementId: null,
  eventId: null,
  rowIdx: null,
});

/**
 * @function createActivityValueForScopedObjectProp
 * @description special case helper for creating the activity value for when the value should be that of the form instance's scoped object
 * @param {Object} formInstance the form instance
 * @param {String} valueType the value type of the activity value
 * @param {String} extId the ext id of the prop that's mapped to the scoped object
 */
const createScopedObjectActivityValue = (formInstance, valueType, extId) => new ActivityValue({
  type: valueType,
  extId: extId,
  submissionValue: [getScopedObjectValue(formInstance)],
  submissionValueType: submissionValueTypes.OBJECT,
  valueMode: activityValueModes.FROM_SUBMISSION,
  value: [getScopedObjectValue(formInstance)],
  sectionId: 'scopedObject',
  elementId: null,
  eventId: null,
  rowIdx: null,
});

/**
 * @function createActivityValueForConnectedSectionSpecialProp
 * @description special case helper for creating the activity value for when it's mapped to one of the special props on a connected section
 * @param {Object} formInstance the form instance
 * @param {Object} reservationTemplateMapping the reservation template mapping of the form
 * @param {String} valueType the value type of the activity value
 * @param {String} extId the ext id of the prop that's mapped to the scoped object
 * @param {String} sectionId the section id
 * @param {String} eventId the event id
 * @param {elementId} the element id
 */
const createActivityValueForConnectedSectionSpecialProp = (
  formInstance,
  reservationTemplateMapping,
  valueType,
  extId,
  sectionId,
  eventId,
  elementId,
) => {
  const submissionValue = [getEventValue(elementId, formInstance, sectionId, eventId)];
  const submissionValueType = elementId === 'title'
    ? submissionValueTypes.FREE_TEXT
    : submissionValueTypes.TIMING;
  const { mode } = reservationTemplateMapping.timing;
  const value = mode === mappingTimingModes.EXACT || submissionValueType === submissionValueTypes.FREE_TEXT
    ? submissionValue
    : null;

  return new ActivityValue({
    type: valueType,
    extId: extId,
    submissionValue,
    submissionValueType,
    valueMode: activityValueModes.FROM_SUBMISSION,
    value,
    sectionId: null,
    elementId: null,
    eventId: null,
    rowIdx: null,
  });
};

/**
 * @function createActivityValueForProp
 * @description create an activity value for a property
 * @param {String} valueType object, field, timing
 * @param {Object} reservationTemplateMapping the form's reservation template mapping
 * @param {*} formInstance the form instance
 * @param {*} sections the form's sections
 * @param {*} eventId the event id (in the case controlling section === SECTION_CONNECTED)
 * @param {*} rowIdx the event id (in the case controlling section === SECTION_TABLE)
 */
export const createActivityValueForProp = (valueType, reservationTemplateMapping, formInstance, sections, eventId, rowIdx) => {
  /**
   * Based on the valueType (objects, fields, timing)
   * we reduce over all the items that in the reservationTemplateMapping have been mapped onto that type
   */
  return (Object.keys(reservationTemplateMapping[activityValueTypeProps[valueType].path]) || []).reduce((retVal, extId) => {
    /**
     * Get the element path of the element for an extId from the reservation template mapping
     * 1. element path structure: [sectionIdInWhichThisElementIsFrom, elementId]
     * 2. There are a couple of important edge cases to this:
     *  2a. ExtId is only an extid for valueType === OBJECT || FIELD;
     *  2b. For valueType === TIMING it's one of mode, startDate, endDate, startTime, endTime, length
     *  2c. Additionally, for scopedObject, the element path is simply ['scopedObject']
     *  2d. For connected sections, the elementId could also be one of the event propertieis, eventTitle, startTime, or endTime
     */

    const elementPath = reservationTemplateMapping[activityValueTypeProps[valueType].path][extId];

    /**
     * There are four cases we need to check for:
     * 1) If we're extracting the value for the TIMING.mode parameter
     * 2) If we're extracting the value of the form instance's scoped object
     * 3) If we're extracting the value of one of the special properties of a connected section's event model
     * 4) The general case; elementPath[0] === sectionId, elementPath[1] === elementId
     */

    /**
     * Special case 1: if the "extId" we are currently on is TIMING.mode
     * then elementPath will contain one of the timing modes
     */
    if (Object.keys(mappingTimingModes).indexOf(elementPath) > -1)
      return [
        ...retVal,
        createTimingModeActivityValue(elementPath),
      ];

    // Get the section id, the elementId
    const sectionId = elementPath[0];
    const elementId = elementPath[1];

    /**
     * Special case 2: if the sectionId === 'scopedObject'
     */
    if (sectionId === 'scopedObject')
      return [
        ...retVal,
        createScopedObjectActivityValue(formInstance, valueType, extId),
      ];

    /**
     * Special case 3: if the elementId value matches one of the special properties on a connected section
     * (and we also have a connected section eventId)
     */
    if (['title', 'startTime', 'endTime'].indexOf(elementId) > -1 && eventId)
      return [
        ...retVal,
        createActivityValueForConnectedSectionSpecialProp(
          formInstance,
          reservationTemplateMapping,
          valueType,
          extId,
          sectionId,
          eventId,
          elementId
        ),
      ];

    /**
     * The general case
     */
    const sectionType = getSectionTypeFromId(sectionId, sections);
    let props = {};
    switch (sectionType) {
      case SECTION_CONNECTED:
        props = getActivityValuePayloadFromConnectedSection(formInstance, sectionId, eventId, elementId, sections);
        break;
      case SECTION_TABLE:
        props = getActivityValuePayloadFromTableSection(formInstance, sectionId, rowIdx, elementId, sections);
        break;
      default:
        props = getActivityValuePayloadFromRegularSection(formInstance, sectionId, elementId, sections);
        break;
    }
    return [
      ...retVal,
      new ActivityValue({
        type: valueType,
        extId,
        ...props,
        sectionId: sectionId,
        elementId: elementId,
        eventId: eventId,
        rowIdx: rowIdx,
      })
    ];
  }, []);
}
