import { ReservationTemplateMapping } from '../../Models/Mapping.model';
import { determineSectionType } from '../../Utils/determineSectionType';
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

export const getMappingStatus = mapping => {
  // If we don't have mapping -> status is NOT_SET
  if (!mapping) return mappingStatuses.NOT_SET;
  // Get the object mapping status
  const objectMappingStatus = Object.keys(mapping.objects).reduce(
    (status, objectKey) => ({
      ...status,
      [objectKey]: {
        status: mapping.objects[objectKey],
        mandatory: mapping.propSettings[objectKey] ? mapping.propSettings[objectKey].mandatory : true
      },
    }),
    {}
  );
  // Get the field mapping status
  const fieldMappingStatus = Object.keys(mapping.fields).reduce(
    (status, fieldKey) => ({
      ...status,
      [fieldKey]: {
        status: mapping.fields[fieldKey],
        mandatory: mapping.propSettings[fieldKey] ? mapping.propSettings[fieldKey].mandatory : true
      },
    }),
    {}
  );
  const isMandatoryObjectMappingComplete = Object.keys(objectMappingStatus).every(
    key => objectMappingStatus[key].status != null || !objectMappingStatus[key].mandatory
  );
  const isMandatoryFieldMappingComplete = Object.keys(fieldMappingStatus).every(
    key => fieldMappingStatus[key].status != null || !fieldMappingStatus[key].mandatory
  );
  if (!isMandatoryObjectMappingComplete || !isMandatoryFieldMappingComplete) return mappingStatuses.PARTIAL;
  const timingMode = mapping.timing.mode;
  if (!timingMode) return mappingStatuses.PARTIAL;
  const mandatoryTimingProps = getMandatoryPropsForTimingMode(timingMode);
  const timingPropsStatus = mandatoryTimingProps.every(key => mapping.timing[key] != null);
  if (!timingPropsStatus) return mappingStatuses.PARTIAL;
  const isObjectMappingComplete = Object.keys(objectMappingStatus).every(
    key => objectMappingStatus[key].status != null
  );
  const isFieldMappingComplete = Object.keys(fieldMappingStatus).every(
    key => fieldMappingStatus[key].status != null
  );
  if (!isObjectMappingComplete || !isFieldMappingComplete) return mappingStatuses.ALL_MANDATORY;
  return mappingStatuses.COMPLETE;
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

export const timingOptions = ({
  [mappingTimingModes.EXACT]: (formSections, mapping) => getExactModeElementsForMapping(formSections, mapping),
  [mappingTimingModes.TIMESLOTS]: (formSections, mapping) => getExactModeElementsForMapping(formSections, mapping),
  [mappingTimingModes.SEQUENCE]: () => {},
});
