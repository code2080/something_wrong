import moment from 'moment';
import { elementTypeMapping } from '../Constants/elementTypes.constants';
import {
  SECTION_VERTICAL,
  SECTION_TABLE,
  SECTION_CONNECTED,
} from '../Constants/sectionTypes.constants';
import { DATE_FORMAT } from '../Constants/common.constants';
import { determineSectionType } from './determineSectionType.helpers';

/**
 * @function pickElement
 * @description picks an element from the form based on its element and section ids
 * @param {*} elementId the id of the element to pick
 * @param {*} sectionId the id of the section where the element is
 * @param {*} sections all the form's sections
 */
export const pickElement = (elementId, sectionId, sections) => {
  try {
    const section = sections.find((el) => el._id === sectionId);
    const element = section.elements.find((el) => el._id === elementId);
    return element;
  } catch (error) {
    return null;
  }
};

/**
 * @function getElementTypeFromId
 * @description returns the element type from an element id
 * @param {String} elementId the element id
 * @returns {String} element type
 */
export const getElementTypeFromId = (elementId) => {
  const elementIdx = Object.keys(elementTypeMapping).findIndex(
    (elementType) => elementTypeMapping[elementType].elementId === elementId,
  );
  if (elementIdx > -1) return Object.keys(elementTypeMapping)[elementIdx];
  return null;
};

const findElementValueInRegularSection = (elementId, section) => {
  if (!section) {
    console.log('No section in findElementValueInRegularSection');
    return null;
  }
  const elIdx = section.findIndex((el) => el.elementId === elementId);
  if (elIdx > -1) return section[elIdx].value;
  return null;
};

const findElementValueInTableSection = (elementId, section) => {
  if (!section) {
    console.log('No section in findElementValueInTableSection');
    return null;
  }
  const rowArr = Object.keys(section).map((rowIdx) => section[rowIdx]);
  const values = rowArr.values.reduce((values, row) => {
    const elIdx = row.findIndex((el) => el.elementId === elementId);
    if (elIdx > -1) return [...values, ...row[elIdx].value];
    return values;
  }, []);
  if (values && values.length) return values;
  return null;
};

const findElementValueInConnectedSection = (elementId, section) => {
  if (!section) {
    console.log('No section in findElementValueInConnectedSection');
    return null;
  }
  const eventArr = Object.keys(section).map((eventId) => section[eventId]);
  const values = eventArr.reduce((values, event) => {
    const elIdx = event.values.findIndex((el) => el.elementId === elementId);
    if (elIdx > -1) return [...values, ...event.values[elIdx].value];
    return values;
  }, []);
  if (values && values.length) return values;
  return null;
};

/**
 * @function findElementValueInSubmission
 * @description returns the element value from an element id
 * @param {String} elementId the element id
 * @param {Object} values the submission values
 * @returns {String} element value
 */
export const findElementValueInSubmission = (element, sections, values) => {
  // Find the appropriate section
  const sectionIdx = sections.findIndex(
    (section) => section._id === element.sectionId,
  );
  if (sectionIdx === -1) return null;
  const sectionValues = values[element.sectionId];
  const sectionType = determineSectionType(sections[sectionIdx]);
  switch (sectionType) {
    case SECTION_VERTICAL:
      return findElementValueInRegularSection(element.elementId, sectionValues);
    case SECTION_TABLE:
      return findElementValueInTableSection(element.elementId, sectionValues);
    case SECTION_CONNECTED:
      return findElementValueInConnectedSection(
        element.elementId,
        sectionValues,
      );
    default:
      return null;
  }
};

/**
 * @function findElementValueInSubmissionFromId
 * @description returns the element value from an element id
 * @param {String} elementId the element id
 * @param {String} sectionId the section id
 * @param {Array} sections the sections in the form
 * @param {Object} values the submission values
 * @returns {String} element value
 */
export const findElementValueInSubmissionFromId = (
  elementId,
  sectionId,
  sections,
  values,
) => {
  // Find the appropriate section
  const sectionIdx = sections.findIndex((section) => section._id === sectionId);
  if (sectionIdx === -1) return null;
  const sectionValues = values[sectionId];
  const sectionType = determineSectionType(sections[sectionIdx]);
  switch (sectionType) {
    case SECTION_VERTICAL:
      return findElementValueInRegularSection(elementId, sectionValues);
    case SECTION_TABLE:
      return findElementValueInTableSection(elementId, sectionValues);
    case SECTION_CONNECTED:
      return findElementValueInConnectedSection(elementId, sectionValues);
    default:
      return null;
  }
};

/**
 * @function extractOptionFromValue
 * @description returns the element option based on the value
 * @param {String} value the selected value
 * @param {Array} options the options
 * @returns {Object} the options object
 */
export const extractOptionFromValue = (value, options) => {
  const optionIdx = (options || []).findIndex((opt) => opt.value === value);
  if (optionIdx === -1) return { value, label: 'N/A' };
  return options[optionIdx];
};

/**
 * @function formatElementValue
 * @description convert element value to readable text
 * @param {any} value the element raw value
 */
export const formatElementValue = (value, divider) => {
  const arrayToString = (value, divider) => {
    return value.map((item) => formatElementValue(item, divider));
  };

  const objectToString = (value, divider) => {
    return arrayToString(
      Object.keys(value).map(
        (key) => `${formatElementValue(value[key], divider)}`,
      ),
      divider,
    );
  };

  if (value === null || value === undefined) return value;
  if (Array.isArray(value)) {
    return arrayToString(value, divider);
  }
  if (typeof value === 'object') {
    if (!Object.keys(value).length) return '';
    if (value instanceof Date) return value;
    if (moment.isMoment(value)) {
      const momentValue = moment(value);
      if (value._f)
        return momentValue.format((value._f || '').replace(':ss', ''));
      return momentValue.format(DATE_FORMAT);
    }
    return objectToString(value, divider);
  }
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return value;
};
