import {
  SECTION_VERTICAL,
} from '../Constants/sectionTypes.constants';
import { elementTypeMapping } from '../Constants/elementTypes.constants';
import { valueTypes } from '../Constants/valueTypes.constants';
import { determineSectionType } from './sections.helpers';
import { renderElementValue } from './rendering.helpers';

/**
 * @function extractSubmissionColumns
 * @description returns all columns in a form that can be displayed in a table
 * @param {Object} form
 * @returns {Array<Object>} array of columns
 */

export const extractSubmissionColumns = form => {
  // Get all regular sections
  const { sections } = form;
  const regularSections = sections.filter(section => determineSectionType(section) === SECTION_VERTICAL);

  // Get array of acceptable element ids
  const safeElTypes = (Object.keys(elementTypeMapping) || [])
    // .filter(elType => elementTypeMapping[elType].valueType === valueTypes.SINGLE)
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
          sorter: (a, b) => a[el._id] - b[el._id],
          render: value => renderElementValue(value, el),
        }))
    ],
  []);
};

/**
 * @function extractSubmissionData
 * @description extracts data from an arbitrary number of submissions based on an arbitrary set of columns
 * @param {Array<Object>} submissions the submissions to process
 * @param {Array<Object<} cols the columns to extract values from
 */

export const extractSubmissionData = (submissions, cols) => {
  /**
   * @important function assumes all values to be processed are in SECTION_VERTICALs
   */
  return submissions.reduce(
    (extractedData, submission) => {
      const { values } = submission;
      return {
        ...extractedData,
        [submission._id]: (cols || []).reduce((row, col) => {
          const { sectionId, dataIndex: elementId } = col;
          // Loop through alues to find right elementIdx
          const elementIdx = values[sectionId] ? values[sectionId].findIndex(el => el.elementId === elementId) : -1;
          if (elementIdx === -1) return row;
          return { ...row, [elementId]: values[sectionId][elementIdx].value };
        }, {}),
      };
    },
    {}
  );
};
