// CONSTANTS
import { ActivityValueType } from '../Constants/activityValueTypes.constants';
import { submissionValueTypes } from '../Constants/submissionValueTypes.constants';

/**
 * @function determineContentOfValue
 * @description asserts which type of content the activityValue.value contains
 * @param {Object} activityValue the activity value to be assessed
 * @returns {String} value type (enum of submissionValueTypes)
 */
export const determineContentOfValue = (activityValue) => {
  if (activityValue.type !== ActivityValueType.OBJECT) return null;
  if (Array.isArray(activityValue.value)) return submissionValueTypes.OBJECT;
  return submissionValueTypes.FILTER;
};
