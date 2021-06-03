type LookupType = {
  [id: string]: {
    activityIds: string[];
    label?: string;
  };
};

export type TFilterLookUpMap = {
  readonly submitter: LookupType;
  readonly tag: LookupType;
  readonly primaryObject: LookupType;
  readonly objects: LookupType;
};
class FilterLookUpMap implements TFilterLookUpMap {
  readonly submitter: LookupType;
  readonly tag: LookupType;
  readonly primaryObject: LookupType;
  readonly objects: LookupType;

  constructor({
    submitter = {},
    tag = {},
    primaryObject = {},
    objects = {},
  }: {
    submitter: LookupType;
    tag: LookupType;
    primaryObject: LookupType;
    objects: LookupType;
  }) {
    this.submitter = submitter;
    this.tag = tag;
    this.primaryObject = primaryObject;
    this.objects = objects;
  }
}

export default FilterLookUpMap;
