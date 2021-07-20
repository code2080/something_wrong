import { DATE_FORMAT } from "Constants/common.constants";
import { compact } from "lodash";
import moment from "moment";
import { TATimingQuery, TFilterQuery, TFieldQuery, TObjectQuery } from "Types/ActivityFilter.type";

export class ActivityFilterPayload {
  submitter: string[];
  tag: string[];
  primaryObject: string[];
  objectFilters: TObjectQuery[];
  objects: TObjectQuery[];
  filters: TFilterQuery;
  fields: TFieldQuery;
  timing?: TATimingQuery;

  constructor(data) {
    const { startDate, endDate, startTime, endTime, tag, primaryObject, objects, filters, objectFilters, fields } = data;
    this.timing = {
      startDate: compact([startDate ? moment.utc(startDate).format(DATE_FORMAT) : null]),
      endDate: compact([endDate ? moment.utc(endDate).format(DATE_FORMAT) : null]),
      startTime: compact([startTime ? moment.utc(startTime).toJSON() : null]),
      endTime: compact([endTime ? moment.utc(endTime).toJSON() : null]),
    };
    this.tag = tag;
    this.primaryObject = primaryObject;
    this.objects = objects;
    this.filters = filters;
    this.fields = fields;
    this.submitter = data.submitter;
    this.objectFilters = objectFilters;
  }
};

