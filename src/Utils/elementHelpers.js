import { elementTypeMapping } from '../Constants/elementTypes.constants';
/**
 * @function getElementTypeFromId
 * @description returns the element type from an element id
 * @param {String} elementId the element id
 * @returns {String} element type
 */
export const getElementTypeFromId = elementId => {
  const elementIdx = Object.keys(elementTypeMapping).findIndex(
    elementType => elementTypeMapping[elementType].elementId === elementId
  );
  if (elementIdx > -1) return Object.keys(elementTypeMapping)[elementIdx];
  return null;
};
