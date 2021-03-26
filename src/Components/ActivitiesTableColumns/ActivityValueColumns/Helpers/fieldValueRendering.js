// VALIDATION
import { validateGeneralValue } from '../../../../Utils/activityValues.validation';

// COMPONENTS
import FieldValue from '../ValueTypes/FieldValue';

// HELPERS
import { ActivityValueRenderPayload } from './RenderPayload';

// CONSTANTS
import { activityValueStatuses } from '../../../../Constants/activityStatuses.constants';

/**
 * @function renderFieldComponent
 * @description Entry point for rendering all field components
 * @param {ActivityValue} activityValue
 * @returns RenderPayload
 */
export const renderFieldComponent = (activityValue, activity) => {
  const validationResult = validateGeneralValue(activityValue);
  if (validationResult.errorCode)
    return ActivityValueRenderPayload.create({
      status: activityValueStatuses.MISSING_DATA,
      errorMessage: 'Activity value contains unknown property type',
    });

  return ActivityValueRenderPayload.create({
    status: activityValueStatuses.READY_FOR_SCHEDULING,
    renderedComponent: (
      <FieldValue
        value={activityValue.value}
        extId={activityValue.extId}
        activityId={activity._id}
      />
    ),
  });
};
