export type TObjectQuery = {
  [typeExtId: string]: string[];
};

export type TFieldQuery = {
  [fieldExtId: string]: string[];
};

export type TFilterQuery = {
  [typeExtId: string]: {
    [fieldExtId: string]: string[];
  };
};

export type TATimingQuery = {
  startTime: string[];
  endTime: string[];
  startDate: string[];
  endDate: string[];
};

export type TActivityFilterQuery = {
  submitter?: string[];
  tag?: string[];
  primaryObject?: string[];
  objects?: TObjectQuery[];
  filters?: TFilterQuery[];
  fields?: TFieldQuery;
  timing?: TATimingQuery[];
};
