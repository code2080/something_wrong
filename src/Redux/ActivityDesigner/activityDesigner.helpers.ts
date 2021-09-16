import _, { filter } from 'lodash';
import { CascaderOptionType } from 'antd/lib/cascader';
import { determineSectionType } from '../../Utils/determineSectionType.helpers';
import {
  activityTimeModes,
  activityTimeModeProps,
} from '../../Constants/activityTimeModes.constants';
import { mappingStatuses } from '../../Constants/mappingStatus.constants';
import { mappingTypes } from '../../Constants/mappingTypes.constants';

import {
  SECTION_TABLE,
  SECTION_CONNECTED,
} from '../../Constants/sectionTypes.constants';

export const getMandatoryPropsForTimingMode = (mode) =>
  activityTimeModeProps[mode].mandatoryProperties;

export const getMappingSettingsForProp = (prop, mapping) =>
  _.get(mapping, `propSettings[${prop}]`, null);
export const getMappingTypeForProp = (prop, mapping) => {
  if (Object.prototype.hasOwnProperty.call(mapping.objects, prop))
    return mappingTypes.OBJECT;
  if (Object.prototype.hasOwnProperty.call(mapping.fields, prop))
    return mappingTypes.FIELD;
  if (Object.prototype.hasOwnProperty.call(mapping.timing, prop))
    return mappingTypes.TIMING;
  return mappingTypes.UNDEFINED;
};

export const validateTemplateAgainstMapping = (template, mapping) => {
  const objects = Object.keys(mapping.objects);
  const _objectsMatch = template.objects.every(
    (obj) => objects.indexOf(obj) > -1,
  );
  if (!_objectsMatch) return false;
  const fields = Object.keys(mapping.fields);
  const _fieldsMatch = template.fields.every((obj) => fields.indexOf(obj) > -1);
  if (!_fieldsMatch) return false;
  const keyedProps = [...template.objects, ...template.fields];
  const _settingsMatch = keyedProps.every((prop) =>
    _.isEqual(mapping.propSettings[prop], template.propSettings[prop]),
  );
  if (!_settingsMatch) return false;
  return true;
};

/**
 * @function validateAllKeysOnProp
 * @description validates an object has minLength keys and all keys have a value
 * @param {*} prop the object to validate
 * @param {*} minLength min number of keys
 */
const validateAllKeysOnProp = (prop, minLength = 1) => {
  const keys = Object.keys(prop);
  if (minLength > 0 && (!keys || !(keys.length >= minLength))) return false;
  return !keys.some((key) => prop[key] == null);
};

/**
 * @function validateDesign
 * @description validates whether a design exists and is valid
 * @param {*} formId the form for which to validate the design
 * @param {*} designState the current design state
 */
export const validateDesign = (formId, designState) => {
  const design = _.get(designState, `${formId}`, {});
  // Validate we have an object for the form
  if (!design || !design.formId) return mappingStatuses.NOT_SET;
  // Validate timing
  const timingMode = design.timing.mode;
  if (!timingMode) return mappingStatuses.NOT_SET;
  const mandatoryTimingProps = getMandatoryPropsForTimingMode(timingMode);
  const timingValid = mandatoryTimingProps.every(
    (key) => design.timing[key] != null && design.timing[key].length > 0,
  );
  // Validate objects and fields
  const { objects, fields } = design;
  const objectsValid = validateAllKeysOnProp(objects, 1);
  const fieldsValid = validateAllKeysOnProp(fields, 0);
  return timingValid && objectsValid && fieldsValid
    ? mappingStatuses.COMPLETE
    : mappingStatuses.NOT_SET;
};

/**
 * @function findFirstRepeatingSection
 * @description get the repeating section (table, connected)
 * @param {*} formSections the form's sections
 */
const getRepeatingSection = (formSections) =>
  formSections.find((section) => {
    const sectionType = determineSectionType(section);
    return sectionType === SECTION_CONNECTED || sectionType === SECTION_TABLE;
  });

/**
 * @function getElementsForMapping
 * @description get the elements an object or field can be matched against
 * @param {*} formSections the sections of the form
 * @param {*} mapping the current mapping
 */
export const getElementsForMapping = ({
  formSections,
  mapping,
  settings = {},
}: any) => {
  if (!formSections || !formSections.length || !mapping) return [];
  // Ensure only one repeating section can be used
  const firstRepeatingSection = getRepeatingSection(formSections);

  const elementOptions = formSections.map((section) => {
    const sectionType = determineSectionType(section);
    const isReccuring =
      sectionType === SECTION_TABLE || sectionType === SECTION_CONNECTED;
    const isDisabled =
      firstRepeatingSection &&
      isReccuring &&
      section._id !== firstRepeatingSection._id;
    const activityTemplateEnabled =
      section?.activityTemplatesSettings?.isEnabled;
    const groupsEnabled = section?.groupManagementSettings?.isEnabled;

    return {
      value: section._id,
      label: section.name,
      disabled: isDisabled,
      children: [
        ...(isReccuring
          ? _.compact([
              activityTemplateEnabled && {
                value: 'templates',
                label: 'Activity template',
              },
              groupsEnabled && {
                value: 'groups',
                label: 'Groups',
              },
            ])
          : []),
        ...section.elements.map((element) => ({
          value: element._id,
          label: element.label,
        })),
      ],
    };
  });

  return _.compact([
    settings.primaryObject && {
      value: 'scopedObject',
      label: 'Primary object',
    },
    ...elementOptions,
  ]);
};

/**
 * @function getExactModeElementsForMapping
 * @description gets the elements in a form that can be used for an exact timing mode mapping
 * @param {*} formSections sections of the form
 * @param {*} mapping current mapping
 */
const getExactModeElementsForMapping = (
  formSections,
  mapping,
): {
  startAndEndTime: {
    value: string;
    label: string;
  }[];
  elements: CascaderOptionType;
} => {
  if (!formSections || !formSections.length || !mapping)
    return { startAndEndTime: [], elements: [] };
  // Ensure only one repeating sectionn can be used
  const firstRepeatingSection = getRepeatingSection(formSections);

  const startAndEndTime = [
    {
      value: firstRepeatingSection?._id ?? 'N/A',
      label: firstRepeatingSection?.name ?? 'N/A',
      children: [
        { value: 'startTime', label: 'Event start time' },
        { value: 'endTime', label: 'Event end time' },
      ],
    },
  ];

  return {
    startAndEndTime: firstRepeatingSection ? startAndEndTime : [],
    elements: [
      ...formSections.map((section) => {
        const sectionType = determineSectionType(section);
        const isDisabled =
          firstRepeatingSection &&
          (sectionType === SECTION_TABLE ||
            sectionType === SECTION_CONNECTED) &&
          section._id !== firstRepeatingSection._id;
        const children = section.elements.map((element) => ({
          value: element._id,
          label: element.label,
          elementId: element.elementId,
        }));

        return {
          value: section._id,
          label: section.name,
          disabled: isDisabled,
          children,
        };
      }),
    ],
  };
};

/**
 * @function getElementsForTimingMapping
 * @description gets the compatible elements for timing mapping
 */
export const getElementsForTimingMapping = {
  [activityTimeModes.EXACT]: (formSections, mapping) =>
    getExactModeElementsForMapping(formSections, mapping),
  [activityTimeModes.TIMESLOTS]: (formSections, mapping) =>
    getExactModeElementsForMapping(formSections, mapping),
  [activityTimeModes.SEQUENCE]: (formSections, mapping) =>
    getExactModeElementsForMapping(formSections, mapping),
};
