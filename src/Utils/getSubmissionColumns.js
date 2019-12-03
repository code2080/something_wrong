import {
  SECTION_VERTICAL,
} from '../Constants/sectionTypes.constants';
import { elementTypeMapping } from '../Constants/elementTypes.constants';
import { valueTypes } from '../Constants/valueTypes.constants';
import { determineSectionType } from './determineSectionType';

/**
 * @function getSubmissionColumns
 * @description returns all columns in a form that can be displayed in a table
 * @param {Object} form
 * @returns {Array<Object>} array of columns
 */

export const getSubmissionColumns = form => {
  // Get all regular sections
  const { sections } = form;
  const regularSections = sections.filter(section => determineSectionType(section) === SECTION_VERTICAL);

  // Get array of acceptable element ids
  const safeElTypes = (Object.keys(elementTypeMapping) || [])
    .filter(elType => elementTypeMapping[elType].valueType === valueTypes.SINGLE)
    .map(elType => elementTypeMapping[elType].elementId);

  // Grab all safe elements and transform to columns
  return regularSections.reduce((_safeEls, section) =>
    [
      ..._safeEls,
      ...section.elements
        .filter(el => safeElTypes.indexOf(el.elementId) > -1)
        .map(el => ({
          title: el.label,
          dataIndex: el._id,
          key: el.label,
          sectionId: section._id,
          sorter: (a, b) => a[el._id] - b[el._id]
        }))
    ],
  []);
};
