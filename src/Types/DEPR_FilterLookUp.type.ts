type ActivityIdList = string[];

type LookupType = {
  [id: string]: ActivityIdList;
};

type ObjectLookupType = {
  [typeExtId: string]: { [objectExtId: string]: ActivityIdList };
};

type FieldLookupType = {
  [fieldExtId: string]: { [fieldValue: string]: ActivityIdList };
};

type ObjectFilterLookupType = {
  [typeExtId: string]: FieldLookupType;
};

export type TFilterLookUpMap = Partial<{
  readonly submitter: LookupType;
  readonly tag: LookupType;
  readonly primaryObject: LookupType;
  readonly objects: ObjectLookupType;
  readonly fields: FieldLookupType;
  readonly objectFilters: ObjectFilterLookupType;
}>;

class FilterLookUpMap implements TFilterLookUpMap {
  readonly submitter: LookupType;
  readonly tag: LookupType;
  readonly primaryObject: LookupType;
  readonly objects: ObjectLookupType;
  readonly fields: FieldLookupType;
  readonly objectFilters: ObjectFilterLookupType;

  constructor({
    submitter = {},
    tag = {},
    primaryObject = {},
    objects = {},
    fields = {},
    objectFilters = {},
  }: {
    submitter: LookupType;
    tag: LookupType;
    primaryObject: LookupType;
    objects: ObjectLookupType;
    fields: FieldLookupType;
    objectFilters: ObjectFilterLookupType;
  }) {
    this.submitter = submitter;
    this.tag = tag;
    this.primaryObject = primaryObject;
    this.objects = objects;
    this.fields = fields;
    this.objectFilters = objectFilters;
  }
}

export default FilterLookUpMap;
