import {
  activityValueTypes,
  activityValueTypeProps
} from '../Constants/activityValueTypes.constants';
import {
  TECoreFieldModel,
  TECoreObjectModel,
  TECoreReservationModel
} from '../Models/TECoreReservation.model';

const convertActivityValueToReservationProp = activityValue => {
  switch (activityValue.type) {
    case activityValueTypes.FIELD:
      return new TECoreFieldModel(activityValue);
    case activityValueTypes.OBJECT:
      return new TECoreObjectModel(activityValue);
    default:
      break;
  }
};

const convertValuesToReservationProps = activity =>
  (activity.values || []).reduce(
    (prev, activityValue) => ({
      ...prev,
      [activityValueTypeProps[activityValue.type].path]: [
        ...prev[activityValueTypeProps[activityValue.type].path],
        convertActivityValueToReservationProp(activityValue)
      ]
    }),
    { objects: [], fields: [] }
  );

export const formatActivityForExactScheduling = activity => {
  /**
   * Create the reservation
   */
  const { objects, fields } = convertValuesToReservationProps(activity);
  const _startTime = activity.timing.find(el => el.extId === 'startTime');
  const _endTime = activity.timing.find(el => el.extId === 'endTime');
  const startTime = _startTime.value;
  const endTime = _endTime.value;
  return new TECoreReservationModel({
    startTime,
    endTime,
    objects,
    fields
  });
};
