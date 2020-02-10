import { determineSectionType } from './determineSectionType';
import {
  SECTION_TABLE,
  SECTION_CONNECTED
} from '../Constants/sectionTypes.constants';
import { reservationStatuses } from '../Constants/reservationStatuses.constants';
import { mappingTimingModes } from '../Constants/mappingTimingModes.constants';
import { Reservation } from '../Models/Reservation.model';
import { ReservationValue } from '../Models/ReservationValue.model';
import { submissionValueTypes } from '../Constants/submissionValueTypes.constants';
import { reservationValueModes } from '../Constants/reservationValueModes.constants';

const getSectionsFromMapping = (sections, mapping) => {
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

const getSectionTypes = sections => sections.map(el => ({ sectionId: el._id, sectionType: determineSectionType(el) }));
const getSectionTypeFromId = (sectionId, sections) => {
  const sectionIdx = sections.findIndex(el => el._id === sectionId);
  if (sectionIdx === -1) return null;
  return determineSectionType(sections[sectionIdx]);
};
const getSectionFromId = (sectionId, sections) => {
  const sectionIdx = sections.findIndex(el => el._id === sectionId);
  if (sectionIdx === -1) return null;
  return sections[sectionIdx];
};
const getElementFromSection = (elementId, section) => section.elements.find(el => el._id === elementId);
const ensureValueIsArray = value => {
  if (Array.isArray(value)) return value;
  return [value];
};

const getReservationValuePayload = (element, rawValue) => {
  const _rawValue = ensureValueIsArray(rawValue);
  const _defPayload = {
    submissionValue: _rawValue,
    submissionValueType: submissionValueTypes.FREE_TEXT,
    valueMode: reservationValueModes.FROM_SUBMISSION,
    value: _rawValue[0],
  };
  // IF no datasource we interpret the value as is
  if (!element.datasource)
    return _defPayload
  // Split the data source to get its components
  const datasource = element.datasource.split(',');
  // If data source doesn't match format, return def value payload
  if (!datasource.length || datasource.length < 2)
    return _defPayload;
  // If datasource[1] === 'object'
  if (datasource[1] === 'object')
    return { ..._defPayload, submissionValueType: submissionValueTypes.OBJECT };
  return {
    submissionValue: [{ field: datasource[1], value: rawValue }],
    submissionValueType: submissionValueTypes.FILTER,
    valueMode: reservationValueModes.FROM_SUBMISSION,
    value: null,
  };
};

const determiningSectionInterface = ({
  validation: 'VALID',
  determiningSectionId: null,
  sectionType: null,
  mappedSections: [],
});

const calculateDeterminingSection = (sections, mapping) => {
  /**
   * Calculate number of reservations
   * Logic:
   * 1) If no repeating sections in mapping -> form instance turns into 1 reservation
   * 2) If we have a repeating section -> form instance turns into values.length reservations from the repeating sectionn
   */
  // Get all mapped sections
  const sectionsMapped = getSectionsFromMapping(sections, mapping);
  // Get the section types
  const sectionTypes = getSectionTypes(sectionsMapped);
  return sectionTypes.reduce((retVal, section) => {
    // Check if we have a repeating section
    if (section.sectionType === SECTION_CONNECTED || section.sectionType === SECTION_TABLE) {
      // If we already have another determining sectionId => mapping is invalid (multiple repeating sections)
      if (retVal.determiningSectionId)
        return {
          ...retVal,
          validation: 'ERROR',
        };
      // If not, set the determining section
      return {
        ...retVal,
        determiningSectionId: section.sectionId,
        sectionType: section.sectionType,
        mappedSections: [...retVal.mappedSections, section.sectionId],
      };
    }
    // Not a repeating section, just add the section id to mapped sections
    return {
      ...retVal,
      mappedSections: [...retVal.mappedSections, section.sectionId],
    };
  }, determiningSectionInterface);
}

const getEventValue = (prop, formInstance, sectionId, eventId) => formInstance.values[sectionId][eventId][prop];
const getScopedObjectValue = formInstance => formInstance.scopedObject;
const getPayloadFromConnectedSection = (formInstance, sectionId, eventId, elementId, sections) => {
  if (!formInstance || !sectionId || !eventId || !elementId || !sections) return null;
  const section = getSectionFromId(sectionId, sections);
  if (!section) return null;
  const eventValues = formInstance.values[sectionId][eventId].values;
  if (!eventValues) return null;
  const elementIdx = eventValues.findIndex(el => el.elementId === elementId);
  if (elementIdx === -1) return null;
  const rawValue = eventValues[elementIdx].value;
  const element = getElementFromSection(elementId, section);
  if (!element) return null;
  return getReservationValuePayload(element, rawValue);
};

const getPayloadFromTableSection = (formInstance, sectionId, rowIdx, elementId, sections) => {
  if (!formInstance || !sectionId || !rowIdx || !elementId || !sections) return null;
  const section = getSectionFromId(sectionId, sections);
  if (!section) return null;
  const rowValues = formInstance.values[sectionId][rowIdx];
  if (!rowValues) return null;
  const elementIdx = rowValues.findIndex(el => el.elementId === elementId);
  if (elementIdx === -1) return null;
  const rawValue = rowValues[elementIdx].value.toString();
  const element = getElementFromSection(elementId, section);
  if (!element) return null;
  return getReservationValuePayload(element, rawValue);
};

const getPayloadFromRegularSection = (formInstance, sectionId, elementId, sections) => {
  if (!formInstance || !sectionId || !elementId || !sections) return null;
  const section = getSectionFromId(sectionId, sections);
  if (!section) return null;
  const sectionValues = formInstance.values[sectionId];
  if (!sectionValues) return null;
  const elementIdx = sectionValues.findIndex(el => el.elementId === elementId);
  if (elementIdx === -1) return null;
  const rawValue = sectionValues[elementIdx].value.toString();
  const element = getElementFromSection(elementId, section);
  if (!element) return null;
  return getReservationValuePayload(element, rawValue);
}

const getSubmissionValuesForKeyedProp = (pathToProp, mapping, formInstance, sections, eventId, rowIdx, type) =>
  (Object.keys(mapping[pathToProp]) || []).reduce((retVal, key) => {
    const el = mapping[pathToProp][key];
    let submissionValue = null;
    let submissionValueType = null;
    let valueMode = null;
    let value = null;
    let sectionId = null;
    let elementId = null;

    // Special case for timing mode
    if (Object.keys(mappingTimingModes).indexOf(el) > -1) {
      submissionValue = [el];
      value = el;
      valueMode = reservationValueModes.FROM_SUBMISSION;
      submissionValueType = submissionValueTypes.TIMING;
    }

    if (el && el[0] && !submissionValue) {
      sectionId = el[0];
      elementId = el[1];

      // Special case: scopedObject
      if (sectionId === 'scopedObject') {
        submissionValue = [getScopedObjectValue(formInstance)];
        submissionValueType = submissionValueTypes.OBJECT;
        valueMode = reservationValueModes.FROM_SUBMISSION;
        value = submissionValue;
      }
      // Special connected section cases: eventTitle, startTime, endTime
      if (['title', 'startTime', 'endTime'].indexOf(elementId) > -1 && eventId) {
        submissionValue = [getEventValue(elementId, formInstance, sectionId, eventId)];
        submissionValueType = elementId === 'title'
          ? submissionValueTypes.FREE_TEXT
          : submissionValueTypes.TIMING;
        valueMode = reservationValueModes.FROM_SUBMISSION;
        const { mode } = mapping.timing;
        value = mode === mappingTimingModes.EXACT || submissionValueType === submissionValueTypes.FREE_TEXT
          ? submissionValue
          : null;
      }
      if (!submissionValue) {
        const sectionType = getSectionTypeFromId(sectionId, sections);
        // General cases
        if (sectionType === SECTION_CONNECTED && eventId) {
          ({ submissionValue, submissionValueType, valueMode, value } = getPayloadFromConnectedSection(formInstance, sectionId, eventId, elementId, sections));
        } else if (sectionType === SECTION_TABLE && rowIdx) {
          ({ submissionValue, submissionValueType, valueMode, value } = getPayloadFromTableSection(formInstance, sectionId, rowIdx, elementId, sections));
        } else {
          ({ submissionValue, submissionValueType, valueMode, value } = getPayloadFromRegularSection(formInstance, sectionId, elementId, sections));
        }
      }
    }
    const reservationValue = new ReservationValue({
      type: type,
      extId: key,
      submissionValue, // Should always be the submission value,
      submissionValueType, // Should differentiate between an object (determined) and filters (non determined),
      valueMode,
      value, // Based on valueMode, submissionValueType. Can be populated (FROM_SUBMISSION, MANUAL), or runtime populated (BEST_FIT)
      sectionId: sectionId,
      elementId: elementId,
      eventId: eventId,
      rowIdx: rowIdx,
    });
    return [...retVal, reservationValue];
  }, []);

const createReservation = (
  reservationTemplateExtId = null,
  mapping,
  formInstance,
  _sectionId,
  eventId = null,
  rowIdx = null,
  sections
) => {
  // Get the object values
  const objectValues = getSubmissionValuesForKeyedProp('objects', mapping, formInstance, sections, eventId, rowIdx, 'object');
  // Get the field values
  const fieldValues = getSubmissionValuesForKeyedProp('fields', mapping, formInstance, sections, eventId, rowIdx, 'field');
  // Get the timing values
  const timingValues = getSubmissionValuesForKeyedProp('timing', mapping, formInstance, sections, eventId, rowIdx, 'timing');
  // Create the reservation embry
  return new Reservation({
    formId: formInstance.formId,
    formInstanceId: formInstance._id,
    sectionId: _sectionId,
    eventId: eventId,
    rowIdx: rowIdx,
    reservationTemplateExtId: reservationTemplateExtId,
    reservationStatus: reservationStatuses.NOT_SCHEDULED,
    timing: timingValues,
    values: [...objectValues, ...fieldValues],
  })
};

export const createReservations = (formInstance, sections, mapping, reservationTemplateExtId) => {
  if (!mapping || !sections || !sections.length || !mapping || !reservationTemplateExtId) return [];
  // Get the determining section
  const mappingInfo = calculateDeterminingSection(sections, mapping);
  // If we DON'T have a determining section -> collect the values for 1 booking
  if (!mappingInfo.determiningSectionId) {
    // Collect all the values from the mapped sections
    return [createReservation(reservationTemplateExtId, mapping, formInstance, null, null, null, sections)];
  } else {
    const repeatingSectionValues = formInstance.values[mappingInfo.determiningSectionId];
    return (Object.keys(repeatingSectionValues) || []).map(
      key => createReservation(
        reservationTemplateExtId,
        mapping,
        formInstance,
        mappingInfo.determiningSectionId,
        mappingInfo.sectionType === SECTION_CONNECTED ? key : null,
        mappingInfo.sectionType === SECTION_TABLE ? key : null,
        sections
      )
    );
  }
};
