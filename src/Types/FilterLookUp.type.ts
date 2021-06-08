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
  readonly objectFields: ObjectFilterLookupType;
}>;

class FilterLookUpMap implements TFilterLookUpMap {
  readonly submitter: LookupType;
  readonly tag: LookupType;
  readonly primaryObject: LookupType;
  readonly objects: ObjectLookupType;
  readonly fields: FieldLookupType;
  readonly objectFields: ObjectFilterLookupType;

  constructor({
    submitter = {},
    tag = {},
    primaryObject = {},
    objects = {},
    reservationFields: fields = {},
    objectFields = {},
  }: {
    submitter: LookupType;
    tag: LookupType;
    primaryObject: LookupType;
    objects: ObjectLookupType;
    reservationFields: FieldLookupType;
    objectFields: ObjectFilterLookupType;
  }) {
    this.submitter = submitter;
    this.tag = tag;
    this.primaryObject = primaryObject;
    this.objects = objects;
    this.fields = fields;
    this.objectFields = objectFields;
  }
}

export default FilterLookUpMap;
