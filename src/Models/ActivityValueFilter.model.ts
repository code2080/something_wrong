import { compact } from 'lodash';
import moment from 'moment';
import {
  deFlattenObject,
  isObject,
} from '../Components/ActivityFiltering/FilterModal/FilterModal.helper';
import { DATE_FORMAT } from '../Constants/common.constants';
import {
  TATimingQuery,
  TFilterQuery,
  TFieldQuery,
  TObjectQuery,
} from '../Types/ActivityFilter.type';

export class ActivityFilterPayload {
  submitter: string[] = [];
  tag: string[] = [];
  primaryObject: string[] = [];
  objectFilters: TObjectQuery[] = [];
  objects: any = {};
  filters: TFilterQuery = {};
  fields: TFieldQuery = {};
  timing?: TATimingQuery;

  constructor(data) {
    const { date, time, settings, ...rest } = data;
    const [startDate, endDate] = date || [];
    const [startTime, endTime] = time || [];
    this.timing = {
      startDate: compact([
        startDate ? moment.utc(startDate).format(DATE_FORMAT) : null,
      ]),
      endDate: compact([
        endDate ? moment.utc(endDate).format(DATE_FORMAT) : null,
      ]),
      startTime: compact([startTime ? moment.utc(startTime).toJSON() : null]),
      endTime: compact([endTime ? moment.utc(endTime).toJSON() : null]),
    };
    const results = deFlattenObject(rest);
    Object.keys(results).forEach((key) => {
      this[key] = results[key];
    });

    // Update only for `objects`
    if (results.objects) {
      this.objects = Object.keys(results.objects).reduce(
        (objectResults, key) => {
          if (isObject(results.objects[key]))
            return {
              ...objectResults,
              [key]: Object.keys(results.objects[key]).map((objectKey) => ({
                fieldExtId: objectKey,
                values: results.objects[key][objectKey],
              })),
            };

          return {
            ...objectResults,
            [key]: results.objects[key],
          };
        },
        {},
      );
    }
  }
}
