import {
  activityValueTypes,
  activityValueTypeProps
} from '../Constants/activityValueTypes.constants';
import {
  TECoreFieldModel,
  TECoreObjectModel,
  TECoreReservationModel
} from '../Models/TECoreReservation.model';

import { SchedulingReturn } from '../Models/SchedulingReturn.model';
import { activityStatuses } from '../Constants/activityStatuses.constants';

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

const parseTECoreResultToScheduleReturn = (teCoreReturn, callback) => {
  const errorCode = teCoreReturn.failures[0]
    ? teCoreReturn.failures[0].result.references[0]
    : 0;
  const errorMessage = teCoreReturn.failures[0]
    ? teCoreReturn.failures[0].result.reservation
    : '';
  callback(
    new SchedulingReturn({
      status:
        teCoreReturn.failures.length === 0
          ? activityStatuses.SCHEDULED
          : activityStatuses.FAILED,
      reservationId: teCoreReturn.newIds[0],
      errorCode,
      errorMessage
    })
  );
};

export const scheduleActivityExact = (activity, teCoreScheduleFn, callback) => {
  /**
   * Create the reservation
   */
  const { objects, fields } = convertValuesToReservationProps(activity);
  const _startTime = activity.timing.find(el => el.extId === 'startTime');
  const _endTime = activity.timing.find(el => el.extId === 'endTime');
  const startTime = _startTime.value;
  const endTime = _endTime.value;
  const reservation = new TECoreReservationModel({
    startTime,
    endTime,
    objects,
    fields
  });
  /**
   * Call the external API
   */
  return teCoreScheduleFn({
    reservation,
    callback: teCoreResult =>
      parseTECoreResultToScheduleReturn(teCoreResult, callback)
  });
};
