import {
  SECTION_VERTICAL,
} from '../Constants/sectionTypes.constants';
import { elementTypeMapping } from '../Constants/elementTypes.constants';
import { determineSectionType } from './determineSectionType.helpers';
import { renderElementValue } from './rendering.helpers';
import { datasourceValueTypes } from '../Constants/datasource.constants';
import { pickElement, findElementValueInSubmissionFromId } from './elements.helpers';

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
  console.log(regularSections);
  return regularSections.reduce((_safeEls, section) =>
    [
      ..._safeEls,
      ...section.elements
        .filter(el => safeElTypes.indexOf(el.elementId) > -1)
        .map(el => ({
          title: el.label,
          dataIndex: el._id,
          key: el._id,
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

/**
 * @function getExtraObjectElementsInForm
 * @description get the elements in a form
 * @param {*} formSections the sections of the form
 */

export const getExtraObjectElementsInForm = (formSections) => {
  if (!formSections || !formSections.length) return [];
  return [
    ...formSections
      .filter(section => determineSectionType(section) === SECTION_VERTICAL)
      .map(section => ({
        value: section._id,
        label: section.name,
        children: section.elements
          .filter(el => el.datasource && el.datasource.split(',')[1] && el.datasource.split(',')[1] === 'object')
          .map(el => ({ value: el._id, label: el.label })),
      })),
  ]
};

/**
 * @function getPayloadForExtraObject
 * @description gets the selection payload for an extra object
 * @param extraObject the extra object
 * @param form the form
 * @param formInstance the form instance
 * @returns extraObjectPayload
 */
export const getPayloadForExtraObject = ({
  extraObject,
  form,
  formInstance,
}) => {
  try {
    if (!extraObject || !extraObject[0]) return null;
    if (extraObject[0] === 'scopedObject') {
      const { objectScope } = form;
      const { scopedObject } = formInstance;
      return [
        { valueType: datasourceValueTypes.OBJECT_EXTID, extId: scopedObject },
        { valueType: datasourceValueTypes.TYPE_EXTID, extId: objectScope },
      ];
    } else {
      const value = findElementValueInSubmissionFromId(extraObject[1], extraObject[0], form.sections, formInstance.values);
      const element = pickElement(extraObject[1], extraObject[0], form.sections);
      const type = element.datasource.split(',')[0];

      return [
        { valueType: datasourceValueTypes.OBJECT_EXTID, extId: Array.isArray(value) ? value[0] : value },
        { valueType: datasourceValueTypes.TYPE_EXTID, extId: type },
      ];
    }
  } catch (error) {
    return null;
  }
};

/**
 * @function getSelectionSettingsTECorePayload
 * @description get the TE Core payload from the selection settings
 * @param selectionSettings the selection settings
 * @param form the form
 * @param formInstance the form instance
 * @param event the event
 */
export const getSelectionSettingsTECorePayload = (selectionSettings, form, formInstance, event) => {
  const extraObjectsPayload = ([['scopedObject'], ...selectionSettings.extraObjects] || []).map(extraObject => getPayloadForExtraObject({ extraObject, form, formInstance }));
  const includedFieldsPaylod = (selectionSettings.includedFields || [])
    .filter(el => el.fieldExtId && el.element && event[el.element])
    .map(includedField => [
      { valueType: datasourceValueTypes.FIELD_EXTID, extId: includedField.fieldExtId },
      { valueType: datasourceValueTypes.FIELD_VALUE, value: event[includedField.element] },
    ])
  return [...extraObjectsPayload, ...includedFieldsPaylod];
}
