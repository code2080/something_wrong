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
