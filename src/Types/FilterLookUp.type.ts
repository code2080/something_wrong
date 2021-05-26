type lookupType = {
  [id: string]: {
    activityIds: string[];
    label?: string;
  };
};

type FilterLookUpMap = {
  submitter: lookupType;
  tag: lookupType;
  primaryObject: lookupType;
};

export default FilterLookUpMap;
