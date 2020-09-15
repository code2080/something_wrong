import { activityValueTypes } from '../Constants/activityValueTypes.constants';
import {
  TECoreFieldModel,
  TECoreObjectModel,
  TECoreReservationModel
} from '../Models/TECoreReservation.model';

const standardizeObjectValue = value => Array.isArray(value) ? value : [value];

const mergeActivityValuesForFields = fields => {
  const mergedFieldMap = (fields || [])
    .reduce((fields, field) => ({ ...fields, [field.extId]: `${fields[field.extId] != null ? fields[field.extId] + ', ' + field.value : field.value}` }), {});
  return Object.keys(mergedFieldMap).map(key => new TECoreFieldModel({ extId: key, value: mergedFieldMap[key] }));
};

const mergeActivityValuesForObjects = objects => {
  const mergedObjectMap = (objects || [])
    .reduce((objs, obj) => ({ ...objs, [obj.extId]: [ ...(objs[obj.extId] || []), ...standardizeObjectValue(obj.value) ] }), {});
  return Object.keys(mergedObjectMap).map(key => new TECoreObjectModel({ extId: key, value: mergedObjectMap[key] }));
};

const convertValuesToReservationProps = activity => {
  // Get all of the same ext id
  const objects = activity.values.filter(aV => aV.type === activityValueTypes.OBJECT);
  const fields = activity.values.filter(aV => aV.type === activityValueTypes.FIELD);
  return {
    objects: mergeActivityValuesForObjects(objects),
    fields: mergeActivityValuesForFields(fields),
  };
}

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
