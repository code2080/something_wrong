// COMPONENTS
import FieldValue from '../ValueTypes/FieldValue';

// HELPERS
import { activityValueStatuses } from '../../../../Constants/activityStatuses.constants';
import { ActivityValueRenderPayload } from './RenderPayload';

// CONSTANTS

/**
 * @function renderFieldComponent
 * @description Entry point for rendering all field components
 * @param {ActivityValue} activityValue
 * @returns RenderPayload
 */
export const renderFieldComponent = (activityValue, activity) => {
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
