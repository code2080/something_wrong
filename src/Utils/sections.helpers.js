import moment from 'moment';
import _ from 'lodash';
import { SelectionSettings } from '../Models/SelectionSettings.model';
import { getElementTypeFromId } from './elements.helpers';
import { elementTypes } from '../Constants/elementTypes.constants';
import { determineSectionType } from './determineSectionType.helpers';
import { TIME_FORMAT } from '../Constants/common.constants';

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
 * @description based on the activity design, determines the sections that should be used in the activities
 * @param {*} sections all sections in the form
 * @param {*} activityDesign the activity design
 * @returns {Array<Object>} sectionsToUse
 */
export const getSectionsToUseInActivities = (sections, activityDesign) => {
  // Loop through objects, fields and get the sectionIds
  const sectionIds = [
    ...(Object.keys(activityDesign.objects) || []).reduce((objects, objectKey) => {
      const elementsForType = activityDesign.objects[objectKey];
      const newPaths = (elementsForType || []).reduce((newPaths, element) => {
        if (element && element[0]) return [...newPaths, element[0]];
        return newPaths;
      }, []);
      return [objects, ...newPaths];
    }, []),
    ...(Object.keys(activityDesign.fields) || []).reduce((fields, fieldKey) => {
      const elementsForField = activityDesign.fields[fieldKey];
      const newPaths = (elementsForField || []).reduce((newPaths, element) => {
        if (element && element[0]) return [...newPaths, element[0]];
        return newPaths;
      }, []);
      return [fields, ...newPaths];
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
  const _startTime = moment.utc(startTime).format(TIME_FORMAT);
  const _endTime = moment.utc(endTime).format(TIME_FORMAT);
  return timeslots.find(timeslot => {
    const slotStart = moment.utc(timeslot.startTime).format(TIME_FORMAT);
    const slotEnd = moment.utc(timeslot.endTime).format(TIME_FORMAT);
    return slotStart === _startTime && slotEnd === _endTime;
  });
};

/**
 * @function getSelectionSettings
 * @description gets the selection settings for a section or returns a default
 * @param sectionId the section id to return the selection settings for
 * @param formInstance the form instance
 * @returns selectionSettings
 */
export const getSelectionSettings = (sectionId, formInstance) =>
  _.get(formInstance, `teCoreProps.selectionSettings.${sectionId}`, new SelectionSettings({}));

/**
 * @function getSelectionFieldElements
 * @description gets the elements in a section that are compatible with being included as a field value
 * @param section the section to filter the elements in
 * @returns fieldElements
 */
export const getSelectionFieldElements = section =>
  (section.elements || [])
    .filter(el => {
      const elementType = getElementTypeFromId(el.elementId);
      return elementType === elementTypes.ELEMENT_TYPE_INPUT_TEXT ||
        elementType === elementTypes.ELEMENT_TYPE_INPUT_NUMBER ||
        elementType === elementTypes.ELEMENT_TYPE_TEXTAREA;
    })
    .map(el => ({ value: el._id, label: el.label }));
