export type TFieldQuery = {
  fieldExtId: string;
  values: string[];
};

export type TFilterQuery = {
  typeExtId: string;
  fieldExtId: string;
  values: string[];
};

export type TActivityFilterQuery = {
  submitter?: string[];
  tag?: string[];
  primaryObject?: string[];
  objects?: string[];
  filters?: TFilterQuery[];
  fields?: TFieldQuery;
  timing?: string[];
};
