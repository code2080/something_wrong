// HELPERS
import { determineSectionTypes } from './determineSectionType.helpers';
import { getSectionsToUseInActivities } from './sections.helpers';
import { createActivityValueForProp } from './activityValues.helpers';

// MODELS
import { Activity } from '../Models/Activity.model';

// CONSTANTS
import { activityStatuses } from '../Constants/activityStatuses.constants';
import { activityValueTypes } from '../Constants/activityValueTypes.constants';
import {
  SECTION_TABLE,
  SECTION_CONNECTED
} from '../Constants/sectionTypes.constants';

const determiningSectionInterface = ({
  validation: 'VALID',
  determiningSectionId: null,
  sectionType: null,
  mappedSections: [],
});

// FUNCTIONS
/**
 * @function ensureBackwardsCompatibleActivityDesign
 * @description ensures all activity design is backwards compatible and coered to look lik [[elementPath], [elementPath]]
 * @param {*} activityDesign the activity design to assert
 */
export const ensureBackwardsCompatibleValueRow = valueRow => {
  /**
   * Updating object format to require double arrays to store multiple mappings for each type
   * To ensure compatibility with old forms, we coerce non-double arrays
   */
  if (!valueRow || valueRow == null || !Array.isArray(valueRow)) return [[]];
  if (!valueRow[0] || !Array.isArray(valueRow[0])) return [valueRow];
  return valueRow;
};

export const ensureBackwardsCompatibleActivityDesign = activityDesign => ({
  ...activityDesign,
  objects: (Object.keys(activityDesign.objects) || []).reduce((keys, key) => ({
    ...keys,
    [key]: ensureBackwardsCompatibleValueRow(activityDesign.objects[key]),
  }), {}),
  fields: (Object.keys(activityDesign.fields) || []).reduce((keys, key) => ({
    ...keys,
    [key]: ensureBackwardsCompatibleValueRow(activityDesign.fields[key]),
  }), {}),
});

export const getTimingModeForActivity = activity => {
  try {
    const aV = activity.timing.find(el => el.extId === 'mode');
    return aV.value;
  } catch (error) {
    return null;
  }
};

/**
 * @function findObjectPathForActivityValue
 * @description finds the path (timing or values) for a value for a certain extId
 * @param {String} valueExtId the extId of the value we're looking for
 * @param {Object} activity the activity with all its values
 * @returns {String} values || timing
 */
export const findObjectPathForActivityValue = (valueExtId, activity) => {
  const timingIdx = activity.timing.findIndex(el => el.extId === valueExtId);
  if (timingIdx > -1) return 'timing';
  const valueIdx = activity.values.findIndex(el => el.extId === valueExtId);
  if (valueIdx > -1) return 'values';
  return null;
};

/**
 * @function determineControllingSectionForActivityConversion
 * @description For converting to activities; determines which section is "controlling", i.e., determines the basis for how many activities should be created
 * @param {*} sections the sections in the form
 * @param {*} activityDesign the activity design
 */
const determineControllingSectionForActivityConversion = (sections, activityDesign) => {
  /**
   * Calculate number of activities
   * Logic:
   * 1) If no repeating sections in design -> form instance turns into 1 activity
   * 2) If we have a repeating section -> form instance turns into values.length activities from the repeating sectionn
   */
  // Get all mapped sections
  const sectionsMapped = getSectionsToUseInActivities(sections, activityDesign);
  // Get the section types
  const sectionTypes = determineSectionTypes(sectionsMapped);
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
};

/**
 * @function createActivity
 * @description creates an activity based on a form instance's activity design, the controlling section and in the case of a repeating section, the eventId or rowIdx
 * @param {*} activityDesign the form's activity design
 * @param {*} formInstance the form instance
 * @param {*} controllingSectionId the controlling section id
 * @param {*} eventId the event id (in case controlling section's section type === SECTION_CONNECTED)
 * @param {*} rowIdx the rowIdx (in case controlling section's section type === SECTION_TABLE)
 * @param {*} sections the sections in the form
 */
const createActivity = (
  activityDesign,
  formInstance,
  controllingSectionId,
  eventId = null,
  rowIdx = null,
  sections
) => {
  /**
   * An activity connsists of
   * 1) identifying properties
   * 2) activity status
   * 3) timing values
   * 4) objects and field values in the values property
   */
  // Grab the object values
  const objectValues = createActivityValueForProp(activityValueTypes.OBJECT, activityDesign, formInstance, sections, eventId, rowIdx, 'object');
  // Grab the field values
  const fieldValues = createActivityValueForProp(activityValueTypes.FIELD, activityDesign, formInstance, sections, eventId, rowIdx);
  // Grab the timing values
  const timingValues = createActivityValueForProp(activityValueTypes.TIMING, activityDesign, formInstance, sections, eventId, rowIdx);

  // Create the activity
  return new Activity({
    formId: formInstance.formId,
    formInstanceId: formInstance._id,
    sectionId: controllingSectionId,
    eventId,
    rowIdx,
    reservationTemplateExtId: null, // DEPRECATED
    activityStatus: activityStatuses.NOT_SCHEDULED,
    timing: timingValues,
    values: [...objectValues, ...fieldValues],
  })
};

/**
 * @function createActivitiesFromFormInstance
 * @description converts a form instance into a set of activities based on the form's activity design
 * @param {*} formInstance the form instance to be converted
 * @param {*} sections the sections of the form
 * @param {*} activityDesign the form's activity design
 * @returns {Array<Object>} activities
 */
export const createActivitiesFromFormInstance = (formInstance, sections, _activityDesign) => {
  // Make sure we have all that we need
  if (!_activityDesign || !sections || !sections.length || !_activityDesign) return [];
  // Assert activity design format
  const activityDesign = ensureBackwardsCompatibleActivityDesign(_activityDesign);

  // Grab the controlling section
  const controllingSectionInfo = determineControllingSectionForActivityConversion(sections, activityDesign);

  // If we don't have a determining section we know the form instance will only be converted into one activity
  if (!controllingSectionInfo.determiningSectionId)
    // Create the one activity and return it
    return [createActivity(activityDesign, formInstance, null, null, null, sections)];

  /**
   * If we have a determining section; each value of that determining section represents 1 activity
   * We thus grab all the values from the determining section,
   * and iterate over them with the createActivity function
   */

  const repeatingSectionValues = formInstance.values[controllingSectionInfo.determiningSectionId];
  return (Object.keys(repeatingSectionValues) || []).map(
    key => createActivity(
      activityDesign,
      formInstance,
      controllingSectionInfo.determiningSectionId,
      controllingSectionInfo.sectionType === SECTION_CONNECTED ? key : null,
      controllingSectionInfo.sectionType === SECTION_TABLE ? key : null,
      sections
    )
  );
};
