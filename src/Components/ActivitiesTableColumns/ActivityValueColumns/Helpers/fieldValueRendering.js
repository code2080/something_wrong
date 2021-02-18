// VALIDATION
import { validateGeneralValue } from '../../../../Utils/activityValues.validation';

// HELPERS
import { ActivityValueRenderPayload } from './RenderPayload';

// CONSTANTS
import { activityValueStatuses } from '../../../../Constants/activityStatuses.constants';

/**
 * @function renderFieldComponent
 * @description Entry point for rendering all field components
 * @param {ActivityValue} activityValue
 * @param {Activity} activity
 * @returns RenderPayload
 */
export const renderFieldComponent = (activityValue, activity) => {
  const validationResult = validateGeneralValue(activityValue);
  if (validationResult.errorCode)
    return ActivityValueRenderPayload.create({
      status: activityValueStatuses.MISSING_DATA,
      errorMessage: validationResult.errorMessage,
      renderedComponent: Array.isArray(activityValue.value) ? activityValue.value.join(', ') : activityValue.value,
    });

  return ActivityValueRenderPayload.create({
    status: activityValueStatuses.MISSING_DATA,
    errorMessage: 'Activity value contains unknown property type',
  });
};
