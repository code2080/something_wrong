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
import { elementTypeMapping } from '../Constants/elementTypes.constants';
import { searchCriteriaNumber, searchCriteriaNumberProps } from '../Constants/searchCriteria.constants';

/**
 * @function ensureValueTypeFormat
 * @description ensures a value is in the right format (object = array, field, timing = single)
 * @param {Any} value the value to check
 * @param {String} valueType the value type
 * @returns {String || Object || Array } the formatted value
 */
const ensureValueTypeFormat = (value, valueType) => {
  switch (valueType) {
    case activityValueTypes.OBJECT: {
      if (Array.isArray(value)) return value;
      return [value];
    }

    case activityValueTypes.TIMING:
    case activityValueTypes.FIELD: {
      if (Array.isArray(value)) return value[0];
      return value;
    }
    default:
      return value;
  }
};

/**
 * @function determineContentOfValue
 * @description asserts which type of content the activityValue.value contains
 * @param {Object} activityValue the activity value to be assessed
 * @returns {String} value type (enum of submissionValueTypes)
 */
export const determineContentOfValue = activityValue => {
  if (activityValue.type !== activityValueTypes.OBJECT) return null;
  if (Array.isArray(activityValue.value)) return submissionValueTypes.OBJECT;
  return submissionValueTypes.FILTER;
}

const transformFieldSearchToFilter = (datasource, rawValue) => {
  return {
    type: datasource[0],
    categories: [],
    exactSearch: rawValue.matchWholeWord,
    searchString: rawValue.value,
    searchFields: [datasource[1]],
  };
}

const transformNumberSearchToFilter = (datasource, rawValue) => {
  return {
    type: datasource[0],
    categories: [],
    searchString: `${searchCriteriaNumberProps[searchCriteriaNumber[rawValue.equality]].label}${rawValue.value}`,
    searchFields: [datasource[1]],
  };
}

const transformDatasourceToFilter = (datasource, rawValue) => {
  return {
    type: datasource[0],
    categories: [{ id: datasource[1], values: [...rawValue] }],
    searchString: null,
    searchFields: null,
  };
}

const createActivityValueFilterPayload = (element, datasource, rawValue) => {
  /**
   * We need to create the filters differently depending on element type
   */
  let value;
  switch (element.elementId) {
    case elementTypeMapping.ELEMENT_TYPE_INPUT_DATASOURCE.elementId:
      value = transformFieldSearchToFilter(datasource, rawValue);
      break;
    case elementTypeMapping.ELEMENT_TYPE_INPUT_NUMBER_DATASOURCE.elementId:
      value = transformNumberSearchToFilter(datasource, rawValue);
      break;
    case elementTypeMapping.ELEMENT_TYPE_DATASOURCE.elementId:
    default:
      value = transformDatasourceToFilter(datasource, rawValue);
      break;
  }
  return {
    submissionValue: [value],
    submissionValueType: submissionValueTypes.FILTER,
    valueMode: activityValueModes.FROM_SUBMISSION,
    value,
  };
}

/**
 * @function formatActivityValuePayload
 * @description general purpose function to format the result of an activity payload generator for one of the section types
 * @param {Object} element the element the value was for
 * @param {Any} rawValue the raw submission value
 * @param {String} valueType the value type
 * @returns {Object} activityValuePayload
 */
const formatActivityValuePayload = (element, rawValue, valueType) => {
  /**
   * Ensure type consistency
   */
  const _rawValue = ensureValueTypeFormat(rawValue, valueType);
  /**
   * Create a default payload - basically a free text base case
   * if all other interpretations fail
   */
  const _defPayload = {
    submissionValue: Array.isArray(_rawValue) ? _rawValue : [_rawValue],
    submissionValueType: submissionValueTypes.FREE_TEXT,
    valueMode: activityValueModes.FROM_SUBMISSION,
    value: _rawValue,
  };
  /**
   * If there's no datasource attached to the object, we can be sure it should be free text interpretation
   */
  if (!element.datasource)
    return _defPayload
  /**
   *  Split the data source to get its components
   */
  const datasource = element.datasource.split(',');
  /**
   * If data source doesn't match format, return def value payload
   */
  if (!datasource.length || datasource.length < 2)
    return _defPayload;
  /**
   * If the datasource contains an object
   */
  if (datasource[1] === 'object')
    return { ..._defPayload, submissionValueType: submissionValueTypes.OBJECT };

  /**
   * Activity value will contain a filter - delegate to dedicated function
   */
  return createActivityValueFilterPayload(element, datasource, rawValue);
};

/**
 * @function getActivityValuePayloadFromConnectedSection
 * @description extracts the base payload for an activity value for a connected section
 * @param {Object} formInstance the form instance
 * @param {String} sectionId the section id
 * @param {String} eventId the event id
 * @param {String} elementId the element id
 * @param {Array} sections all sections in the form
 * @param {String} valueType the activity value's type
 */
const getActivityValuePayloadFromConnectedSection = (formInstance, sectionId, eventId, elementId, sections, valueType, formInstanceObjReqs = []) => {
  if (!formInstance || !sectionId || !eventId || !elementId || !sections) return null;
  const section = getSectionFromId(sectionId, sections);
  if (!section) return null;
  const eventValues = formInstance.values[sectionId][eventId].values.reduce((values, val) => {
    const objReq = formInstanceObjReqs.find(req => req._id === val.value[0]);
    if(objReq) {
      return  [...values, { ...val, value: [objReq.replacementObjectExtId || null] }];
    }
    return [...values, val]
  }, []);
  if (!eventValues) return null;
  const elementIdx = eventValues.findIndex(el => el.elementId === elementId);
  if (elementIdx === -1) return null;
  const rawValue = eventValues[elementIdx].value;
  const element = getElementFromSection(elementId, section);
  if (!element) return null;
  return formatActivityValuePayload(element, rawValue, valueType);
};

/**
 * @function getActivityValuePayloadFromTableSection
 * @description extracts the base payload for an activity value for a table section
 * @param {Object} formInstance the form instance
 * @param {String} sectionId the section id
 * @param {String} rowIdx the table row
 * @param {String} elementId the element id
 * @param {Array} sections all sections in the form
 * @param {String} valueType the activity value's type
 */
const getActivityValuePayloadFromTableSection = (formInstance, sectionId, rowIdx, elementId, sections, valueType) => {
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
  return formatActivityValuePayload(element, rawValue, valueType);
};

/**
 * @function getActivityValuePayloadFromRegularSection
 * @description extracts the base payload for an activity value for a regular section
 * @param {Object} formInstance the form instance
 * @param {String} sectionId the section id
 * @param {String} elementId the element id
 * @param {Array} sections all sections in the form
 * @param {String} valueType the activity value's type
 */
const getActivityValuePayloadFromRegularSection = (formInstance, sectionId, elementId, sections, valueType) => {
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
  return formatActivityValuePayload(element, rawValue, valueType);
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
 * @param {String} valueType the value type of the activity value
 * @param {String} extId the ext id of the prop that's mapped to the scoped object
 * @param {String} sectionId the section id
 * @param {String} eventId the event id
 * @param {elementId} the element id
 */
const createActivityValueForConnectedSectionSpecialProp = (
  formInstance,
  valueType,
  extId,
  sectionId,
  eventId,
  elementId,
) => {
  const submissionValue = [getEventValue(elementId, formInstance, sectionId, eventId)];
  const value = ensureValueTypeFormat(submissionValue, valueType);
  return new ActivityValue({
    type: valueType,
    extId,
    submissionValue,
    submissionValueType: submissionValueTypes.TIMING,
    valueMode: activityValueModes.FROM_SUBMISSION,
    value,
    sectionId: null,
    elementId: null,
    eventId: null,
    rowIdx: null,
  });
};

const extractActivityValue = (
  elementValue,
  extId,
  valueType,
  formInstance,
  sections,
  eventId,
  rowIdx, 
  formInstanceObjReqs = []
) => {
  /**
   * Extraction logic:
   * Cases:
   *  a. ExtId is only an extid for valueType === OBJECT || FIELD;
   *  b. For valueType === TIMING, extId equals one of mode, startDate, endDate, startTime, endTime, length
   *  c. Additionally, for scopedObject, el is simply ['scopedObject']
   *  d. For connected sections, the elementId could also be one of the event properties:
   *    eventTitle DEPRECATED
   *    startTime
   *    endTime
   * This means there are four cases we need to check for
   * 1) If we're extracting the value for the TIMING.mode parameter
   * 2) If we're extracting the value of the form instance's scoped object
   * 3) If we're extracting the value of one of the special properties of a connected section's event model
   * 4) The general case; elementPath[0] === sectionId, elementPath[1] === elementId
  */
  /**
   * CASE 1: TIMING MODE
   */
  if (Object.keys(mappingTimingModes).indexOf(elementValue) > -1)
    return createTimingModeActivityValue(elementValue);

  // Get the section id, the elementId
  const sectionId = elementValue[0];
  const elementId = elementValue[1];
  /**
   * CASE 2: SCOPED OBJECT
   */
  if (sectionId === 'scopedObject')
    return createScopedObjectActivityValue(formInstance, valueType, extId);
  /**
   * CASE 3: CONNECTED SECTION SPECIAL PROPERTIES
   */
  if (['startTime', 'endTime'].indexOf(elementId) > -1 && eventId)
    return createActivityValueForConnectedSectionSpecialProp(
      formInstance,
      valueType,
      extId,
      sectionId,
      eventId,
      elementId
    );
  /**
   * CASE 4: GENERAL CASE
   */
  const sectionType = getSectionTypeFromId(sectionId, sections);
  let props = {};
  switch (sectionType) {
    case SECTION_CONNECTED:
      props = getActivityValuePayloadFromConnectedSection(formInstance, sectionId, eventId, elementId, sections, valueType, formInstanceObjReqs);
      break;
    case SECTION_TABLE:
      props = getActivityValuePayloadFromTableSection(formInstance, sectionId, rowIdx, elementId, sections, valueType);
      break;
    default:
      props = getActivityValuePayloadFromRegularSection(formInstance, sectionId, elementId, sections, valueType);
      break;
  }

  return (props || valueType != 'object') ? new ActivityValue({
    type: valueType,
    extId,
    ...props,
    sectionId: sectionId,
    elementId: elementId,
    eventId: eventId,
    rowIdx: rowIdx,
  }) : null;
}
/**
 * @function createActivityValueForProp
 * @description create an activity value for a property
 * @param {String} valueType object, field, timing
 * @param {Object} activityDesign the form's activity design
 * @param {*} formInstance the form instance
 * @param {*} sections the form's sections
 * @param {*} eventId the event id (in the case controlling section === SECTION_CONNECTED)
 * @param {*} rowIdx the event id (in the case controlling section === SECTION_TABLE)
 */
export const createActivityValueForProp = (valueType, activityDesign, formInstance, sections, eventId, rowIdx, formInstanceObjReqs = []) => {
  /**
   * Based on the valueType (objects, fields, timing)
   * we reduce over all the items that in the activity design have been mapped onto this valueType
   */
  return (Object.keys(activityDesign[activityValueTypeProps[valueType].path]) || []).reduce((retVal, extId) => {
    /**
     * General structure of the content of extId :
     *  a. for valueType === TIMING [sectionIdInWhichThisElementIsFrom, elementId]
     *  b. for valueType !== TIMING [[sectionIdInWhichThisElementIsFrom, elementId]]
     **/
    const mappedElements = activityDesign[activityValueTypeProps[valueType].path][extId];

    if (valueType === activityValueTypes.TIMING) {
      return [
        ...retVal,
        extractActivityValue(
          mappedElements,
          extId,
          valueType,
          formInstance,
          sections,
          eventId,
          rowIdx
        ),
      ]
    } else {
      // Create the activity values based on the mapped elements
      const activityValues = (mappedElements || []).reduce((activityValues, el) => {
        const extractedActivityValue = extractActivityValue(
          el,
          extId,
          valueType,
          formInstance,
          sections,
          eventId,
          rowIdx,
          formInstanceObjReqs
        ); 
        return extractedActivityValue ? [
          ...activityValues,
          extractedActivityValue
        ] : activityValues;
      }, []);
      return [...retVal, ...activityValues];
    }
  }, []);
};
