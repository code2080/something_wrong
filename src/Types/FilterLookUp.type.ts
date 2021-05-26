type FilterLookUpMap = {
  submitter: { [submitterId: string]: string[] };
  tag: { [tagId: string]: string[] };
  primaryObject: { [primaryObjId: string]: string[] };
};

export default FilterLookUpMap;
