import { flatten, isEmpty } from 'lodash';
import moment from 'moment';
import {
  deFlattenObject,
  isObject,
} from '../Components/ActivityFiltering/FilterModal/FilterModal.helper';
import { DATE_FORMAT, TIME_FORMAT } from '../Constants/common.constants';

const objectToString = (values, object, prefix) => {
  return Object.keys(values).forEach((key) => {
    object[`${prefix}.${key}`] = values[key];
  });
};
export class ActivityFilterPayload {
  startTimeInDate?: string;
  endTimeInDate?: string;
  startTimeInMinute?: string;
  endTimeInMinute?: string;
  submitter: string[] = [];
  tag: string[] = [];
  primaryObject: string[] = [];

  constructor(data) {
    const { date, time, settings, filterLookUp, ...rest } = data;
    const [startDate, endDate] = date || [];
    const [startTime, endTime] = time || [];
    this.startTimeInDate =
      startDate && moment.utc(startDate).format(DATE_FORMAT);
    this.endTimeInDate = endDate && moment.utc(endDate).format(DATE_FORMAT);
    this.startTimeInMinute = startTime && moment(startTime).format(TIME_FORMAT);
    this.endTimeInMinute = endTime && moment(endTime).format(TIME_FORMAT);
    const { fields, objects, ...results } = deFlattenObject(rest);
    Object.keys(results).forEach((key) => {
      this[key] = results[key];
    });

    if (!isEmpty(fields)) {
      objectToString(fields, this, 'field');
    }

    // Update only for `objects`
    if (objects) {
      const allObjects = Object.keys(objects).reduce((objectResults, key) => {
        if (isObject(objects[key])) {
          return {
            ...objectResults,
            [key]: flatten(Object.values(objects[key])),
          };
        }

        return {
          ...objectResults,
          [key]: objects[key],
        };
      }, {});
      objectToString(allObjects, this, 'object');
    }
  }
}
