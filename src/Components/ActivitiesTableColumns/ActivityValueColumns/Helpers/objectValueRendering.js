import React from 'react';

// COMPONENTS
import ObjectFilterValue from '../ValueTypes/ObjectFilterValue.jsx';
import ObjectObjectValue from '../ValueTypes/ObjectObjectValue.jsx';

// VALIDATION
import { validateFilterValue, validateGeneralValue } from '../../../../Utils/activityValues.validation';

// HELPERS
import { ActivityValueRenderPayload } from './RenderPayload';

// CONSTANTS
import { activityValueStatuses } from '../../../../Constants/activityStatuses.constants';
import { activityValueTypes } from '../../../../Constants/activityValueTypes.constants';
import { submissionValueTypes } from '../../../../Constants/submissionValueTypes.constants';

/**
 * @function determineObjectValueContent
 * @description asserts which type of content the activityValue.value contains
 * @param {Object} activityValue the activity value to be assessed
 * @returns {String} value type (enum of submissionValueTypes)
 */
const determineObjectValueContent = activityValue => {
  if (activityValue.type !== activityValueTypes.OBJECT) return null;
  if (Array.isArray(activityValue.value)) return submissionValueTypes.OBJECT;
  return submissionValueTypes.FILTER;
}

/**
 * @function renderObjectFilterValue
 * @description renders an object filter component
 * @param {ActivityValue} activityValue
 * @param {Activity} activity
 * @returns RenderPayload
 */
const renderObjectFilterValue = (activityValue, activity) => {
  const validationResult = validateFilterValue(activityValue);
  const value = Array.isArray(activityValue.value) ? activityValue.value : [activityValue.value];
  if (!validationResult.errorCode)
    return ActivityValueRenderPayload.create({
      status: activityValueStatuses.READY_FOR_SCHEDULING,
      value,
      renderedComponent: <ObjectFilterValue value={value} extId={activityValue.extId} activityId={activity._id} />
    });

  return ActivityValueRenderPayload.create({
    status: validationResult.status,
    errorMessage: validationResult.errorMessage,
  });
};

/**
 * @function renderObjectValue
 * @description renders object properties that contain object values
 * @param {ActivityValue} activityValue
 * @param {Activity} activity
 * @returns RenderPayload
 */
const renderObjectValue = (activityValue, activity) => {
  const validationResult = validateGeneralValue(activityValue);
  if (validationResult.errorCode)
    return ActivityValueRenderPayload.create({
      status: validationResult.status,
      errorMessage: validationResult.errorMessage,
    });

  return ActivityValueRenderPayload.create({
    status: activityValueStatuses.READY_FOR_SCHEDULING,
    value: activityValue.value,
    renderedComponent: <ObjectObjectValue value={activityValue.value} extId={activityValue.extId} activityId={activity._id} />,
  });
};

/**
 * @function renderObjectComponent
 * @description Entry point for rendering all timing components
 * @param {ActivityValue} activityValue
 * @param {Activity} activity
 * @returns RenderPayload
 */
export const renderObjectComponent = (activityValue, activity) => {
  // Step 1: determine whether this object activity value contains a filter or objects
  const valueContainsValueOfType = determineObjectValueContent(activityValue);
  if (valueContainsValueOfType === submissionValueTypes.FILTER)
    return renderObjectFilterValue(activityValue, activity);

  if (valueContainsValueOfType === submissionValueTypes.OBJECT)
    return renderObjectValue(activityValue, activity);

  return ActivityValueRenderPayload.create({
    status: activityValueStatuses.MISSING_DATA,
    errorMessage: 'Activity value contains unknown property type',
  });
};
