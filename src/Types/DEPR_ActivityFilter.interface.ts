export enum EActivityFilterType {
  TIMING = 'TIMING',
  OBJECT = 'OBJECT',
  OBJECT_FILTER = 'OBJECT_FILTER',
  FIELD = 'FIELD',
}

export enum EActivityFilterMode {
  some = 'some',
  every = 'every',
}

export enum EActivityFilterInclusion {
  SINGLE = 'SINGLE',
  SUBMISSION = 'SUBMISSION',
}

export type TPaddingFilter = {
  before: string | undefined | null;
  after: string | undefined | null;
};

export type TDateRangeFilter = {
  startTime: string | undefined | null;
  endTime: string | undefined | null;
};

export type TTimingFilter = {
  [key: string]: string | string[] | TPaddingFilter | TDateRangeFilter;
};

export type TObjectFieldFilter = {
  fieldExtId: string;
  values: string[];
};

export type TFilter = {
  extId: string;
  value: string | string[] | undefined | null | TObjectFieldFilter;
};
