import { ReservationTemplateMapping } from '../../Models/ReservationTemplateMapping.model';
import { determineSectionType } from '../../Utils/sections.helpers';
import { mappingTimingModes, mappingTimingModeProps } from '../../Constants/mappingTimingModes.constants';
import { mappingStatuses } from '../../Constants/mappingStatus.constants';
import { mappingTypes } from '../../Constants/mappingTypes.constants';
import _ from 'lodash';

import {
  SECTION_TABLE,
  SECTION_CONNECTED
} from '../../Constants/sectionTypes.constants';

const getMandatoryPropsForTimingMode = mode => mappingTimingModeProps[mode].mandatoryProperties;

export const getMappingSettingsForProp = (prop, mapping) => _.get(mapping, `propSettings[${prop}]`, null);
export const getMappingTypeForProp = (prop, mapping) => {
  if (mapping.objects.hasOwnProperty(prop)) return mappingTypes.OBJECT;
  if (mapping.fields.hasOwnProperty(prop)) return mappingTypes.FIELD;
  if (mapping.timing.hasOwnProperty(prop)) return mappingTypes.TIMING;
  return mappingTypes.UNDEFINED;
};

export const validateTemplateAgainstMapping = (template, mapping) => {
  const objects = Object.keys(mapping.objects);
  const _objectsMatch = template.objects.every(obj => objects.indexOf(obj) > -1);
  if (!_objectsMatch) return false;
  const fields = Object.keys(mapping.fields);
  const _fieldsMatch = template.fields.every(obj => fields.indexOf(obj) > -1);
  if (!_fieldsMatch) return false;
  const keyedProps = [...template.objects, ...template.fields];
  const _settingsMatch = keyedProps.every(prop => _.isEqual(mapping.propSettings[prop], template.propSettings[prop]));
  if (!_settingsMatch) return false;
  return true;
};

export const createNewMappingFromTemplate = (template, extId, formId) =>
  new ReservationTemplateMapping({
    name: template.name,
    reservationTemplateExtId: extId,
    formId,
    objects: (template.objects || []).reduce((objs, el) => ({ ...objs, [el]: null }), {}),
    fields: (template.fields || []).reduce((objs, el) => ({ ...objs, [el]: null }), {}),
    propSettings:
      [...template.objects, ...template.fields]
        .reduce((propSettings, prop) => ({ ...propSettings, [prop]: template.propSettings[prop] }), {}),
  });

/**
 * @function validateAllKeysOnProp
 * @description validates an object has minLength keys and all keys have a value
 * @param {*} prop the object to validate
 * @param {*} minLength min number of keys
 */
const validateAllKeysOnProp = (prop, minLength = 1) => {
  const keys = Object.keys(prop);
  if (minLength > 0 && (!keys || !keys.length >= minLength)) return false;
  return !keys.some(key => prop[key] == null);
};

/**
 * @function validateMapping
 * @description validates whether a mapping exists and is valid
 * @param {*} formId the form for which to validate the mapping
 * @param {*} mappingState the current mapping state
 */
export const validateMapping = (formId, mappingState) => {
  const mapping = _.get(mappingState, `${formId}`, {});
  // Validate we have an object for the form
  if (!mapping || !mapping.formId) return mappingStatuses.NOT_SET;
  // Validate timing
  const timingMode = mapping.timing.mode;
  if (!timingMode) return mappingStatuses.NOT_SET;
  const mandatoryTimingProps = getMandatoryPropsForTimingMode(timingMode);
  const timingValid = mandatoryTimingProps.every(key => mapping.timing[key] != null && mapping.timing[key].length > 0);
  // Validate objects and fields
  const { objects, fields } = mapping;
  const objectsValid = validateAllKeysOnProp(objects, 1);
  const fieldsValid = validateAllKeysOnProp(fields, 0);
  return timingValid && objectsValid && fieldsValid ? mappingStatuses.COMPLETE : mappingStatuses.NOT_SET;
};

/**
 * @function findFirstRepeatingSection
 * @description determine the first (and only) repeating section (table, connected) already used in the mapping
 * @param {*} formSections the form's sections
 * @param {*} mapping the current mapping
 */

const findFirstRepeatingSection = (formSections, mapping) => [
  ...(Object.keys(mapping.timing) || []).reduce(
    (sections, timingKey) => {
      const timing = mapping.timing[timingKey];
      if (timing && timing[0] && timing[1]) return [ ...sections, timing[0] ];
      return sections;
    }, []),
  ...(Object.keys(mapping.objects) || []).reduce(
    (sections, objectKey) => {
      const object = mapping.objects[objectKey];
      if (object && object[0] && object[1]) return [ ...sections, object[0] ];
      return sections;
    }, []),
  ...(Object.keys(mapping.fields) || []).reduce(
    (sections, fieldKey) => {
      const field = mapping.fields[fieldKey];
      if (field && field[0] && field[1]) return [ ...sections, field[0] ];
      return sections;
    }, []),
]
  .reduce((sections, sectionId) => {
    const sectionIdx = formSections.findIndex(el => el._id === sectionId);
    if (sectionIdx > -1) return [ ...sections, formSections[sectionIdx] ];
    return sections;
  }, [])
  .find(el => {
    const sectionType = determineSectionType(el);
    if (sectionType === SECTION_CONNECTED || sectionType === SECTION_TABLE) return true;
    return false;
  });

/**
 * @function getElementsForMapping
 * @description get the elements an object or field can be matched against
 * @param {*} formSections the sections of the form
 * @param {*} mapping the current mapping
 */

export const getElementsForMapping = (formSections, mapping) => {
  if (!formSections || !formSections.length || !mapping) return [];
  // Ensure only one repeating sectionn can be used
  const firstRepeatingSection = findFirstRepeatingSection(formSections, mapping);
  return [
    {
      value: 'scopedObject',
      label: 'Scoped object',
    },
    ...formSections.map(section => {
      const sectionType = determineSectionType(section);
      let isDisabled = false;
      if (
        firstRepeatingSection &&
          (sectionType === SECTION_TABLE || sectionType === SECTION_CONNECTED) &&
            section._id !== firstRepeatingSection._id
      )
        isDisabled = true;

      const children = sectionType === SECTION_CONNECTED
        ? [({ value: 'title', label: 'Event title' }), ...section.elements.map(element => ({ value: element._id, label: element.label }))]
        : section.elements.map(element => ({ value: element._id, label: element.label }));

      return {
        value: section._id,
        label: section.name,
        disabled: isDisabled,
        children: children,
      };
    }),
  ];
};

/**
 * @function getExactModeElementsForMapping
 * @description gets the elements in a form that can be used for an exact timing mode mapping
 * @param {*} formSections sections of the form
 * @param {*} mapping current mapping
 */
const getExactModeElementsForMapping = (formSections, mapping) => {
  if (!formSections || !formSections.length || !mapping) return [];
  // Ensure only one repeating sectionn can be used
  const firstRepeatingSection = findFirstRepeatingSection(formSections, mapping);
  return [
    ...formSections.map(section => {
      const sectionType = determineSectionType(section);
      let isDisabled = false;
      if (
        firstRepeatingSection &&
          (sectionType === SECTION_TABLE || sectionType === SECTION_CONNECTED) &&
            section._id !== firstRepeatingSection._id
      )
        isDisabled = true;

      const children = sectionType === SECTION_CONNECTED
        ? [({ value: 'startTime', label: 'Event start time' }), ({ value: 'endTime', label: 'Event end time' }), ...section.elements.map(element => ({ value: element._id, label: element.label }))]
        : section.elements.map(element => ({ value: element._id, label: element.label }));

      return {
        value: section._id,
        label: section.name,
        disabled: isDisabled,
        children: children,
      };
    }),
  ];
};

/**
 * @function getElementsForTimingMapping
 * @description gets the compatible elements for timing mapping
 */
export const getElementsForTimingMapping = ({
  [mappingTimingModes.EXACT]: (formSections, mapping) => getExactModeElementsForMapping(formSections, mapping),
  [mappingTimingModes.TIMESLOTS]: (formSections, mapping) => getExactModeElementsForMapping(formSections, mapping),
  [mappingTimingModes.SEQUENCE]: () => {},
});
