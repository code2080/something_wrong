export type TActivityFilterLookupMap = {
  submitter: Record<string, number>;
  tag: Record<string, number>;
  primaryObject: Record<string, number>;
  objects: Record<string, Record<string, number>>;
  fields: Record<string, Record<string | number, number>>;
  objectFilters: Record<string, Record<string, Record<string | number, number>>>;
  startTime: Record<string, number>;
  endTime: Record<string, number>;
  startDate: Record<string, number>;
  endDate: Record<string, number>;
};

export const createFn = (obj: any) => ({
  submitter: obj.submitter || {},
  tag: obj.tag || {},
  primaryObject: obj.primaryObject || {},
  objects: obj.objects || {},
  fields: obj.fields || {},
  objectFilters: obj.objectFilters || {},
  startTime: obj.startTime || {},
  endTime: obj.endTime || {},
  startDate: obj.startDate || {},
  endDate: obj.endDate || {},
});
