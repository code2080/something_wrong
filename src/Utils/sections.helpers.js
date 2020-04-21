import moment from 'moment';
import {
  SECTION_VERTICAL,
  SECTION_TABLE,
  SECTION_CONNECTED
} from '../Constants/sectionTypes.constants';

/**
 * @function determineSectionTypes
 * @description determines the types of multiple sections
 * @param {Array} sections the sections
 * @returns {Array<Object>}
 */
export const determineSectionTypes = sections =>
  sections.map(el => ({ sectionId: el._id, sectionType: determineSectionType(el) }));

/**
 * @function determineSectionType
 * @description returns the section type for any given section
 * @param {Object} section the section
 * @returns {String} sectionType
 */
export const determineSectionType = section => {
  if (section.isConnected) return SECTION_CONNECTED;
  if (section.settings && section.settings.hasMultipleValues)
    return SECTION_TABLE;
  return SECTION_VERTICAL;
};

/**
 * @function getSectionTypeFromId
 * @description determines a section type based on its id and all the sections on a form
 * @param {String} sectionId the section id
 * @param {Array} sections all sections on the form
 * @returns {String} sectionType
 */
export const getSectionTypeFromId = (sectionId, sections) => {
  const sectionIdx = sections.findIndex(el => el._id === sectionId);
  if (sectionIdx === -1) return null;
  return determineSectionType(sections[sectionIdx]);
};

/**
 * @function getSectionFromId
 * @description returns a section from an array of ids
 * @param {String} sectionId the section id to return
 * @param {Array} sections all sections on the form
 * @returns {Object} section
 */
export const getSectionFromId = (sectionId, sections) => sections.find(el => el._id === sectionId);

/**
 * @function getElementFromSection
 * @description returns a specific element from a section
 * @param {String} elementId the element id to return the element for
 * @param {Object} section the section to select from
 * @returns {Object} element
 */
export const getElementFromSection = (elementId, section) => section.elements.find(el => el._id === elementId);

/**
 * @function getSectionsToUseInActivities
 * @description based on the reservation template mapping, determines the sections that should be used in the activities
 * @param {*} sections all sections in the form
 * @param {*} mapping the reservation template mapping
 * @returns {Array<Object>} sectionsToUse
 */

export const getSectionsToUseInActivities = (sections, mapping) => {
  // Loop through objects, fields and get the sectionIds
  const sectionIds = [
    ...(Object.keys(mapping.objects) || []).reduce((objects, objectKey) => {
      const object = mapping.objects[objectKey];
      if (object && object[0]) return [...objects, object[0]];
      return objects;
    }, []),
    ...(Object.keys(mapping.fields) || []).reduce((fields, fieldKey) => {
      const field = mapping.fields[fieldKey];
      if (field && field[0]) return [...fields, field[0]];
      return fields;
    }, []),
  ];
  return sectionIds.reduce((foundSections, sectionId) => {
    const sectionIdx = sections.findIndex(el => el._id === sectionId);
    if (sectionIdx > -1) return [...foundSections, sections[sectionIdx]];
    return foundSections;
  }, []);
};

/**
 * @function findTimeSlot
 * @description identifies a time slot based on the start and end time
 * @param {Any} startTime the start time
 * @param {Any} endTime the end time
 * @param {Array} timeslots the timeslots
 * @returns {Object} identifiedTimeslot
 */

export const findTimeSlot = (startTime, endTime, timeslots) => {
  const _startTime = moment(startTime).format('HH:mm');
  const _endTime = moment(endTime).format('HH:mm');
  const timeslotIdx = (timeslots || []).findIndex(
    el =>
      moment(el.startTime).format('HH:mm') === _startTime &&
        moment(el.endTime).format('HH:mm') === _endTime
  );
  if (timeslotIdx > -1) return timeslots[timeslotIdx];
  return null;
};
