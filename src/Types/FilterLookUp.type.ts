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
};
class FilterLookUpMap implements TFilterLookUpMap {
  readonly submitter: LookupType;
  readonly tag: LookupType;
  readonly primaryObject: LookupType;

  constructor({
    submitter = {},
    tag = {},
    primaryObject = {},
  }: {
    submitter: LookupType;
    tag: LookupType;
    primaryObject: LookupType;
  }) {
    this.submitter = submitter;
    this.tag = tag;
    this.primaryObject = primaryObject;
  }
}

export default FilterLookUpMap;
