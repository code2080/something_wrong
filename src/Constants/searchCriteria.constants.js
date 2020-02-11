export const searchCriteriaFreeText = {
  CONTAINS: 'CONTAINS',
  IS_EQUAL_TO: 'IS_EQUAL_TO',
};

export const searchCriteriaFreeTextProps = {
  [searchCriteriaFreeText.CONTAINS]: {
    label: 'contains',
  },
  [searchCriteriaFreeText.IS_EQUAL_TO]: {
    label: 'is equal to',
  },
};

export const searchCriteriaNumber = {
  LESS_THAN: 'LESS_THAN',
  EQUAL_TO: 'EQUAL_TO',
  GREATER_THAN: 'GREATER_THAN',
  NOT_EQUAL_TO: 'NOT_EQUAL_TO',
};

export const searchCriteriaNumberProps = {
  [searchCriteriaNumber.LESS_THAN]: {
    label: '<',
  },
  [searchCriteriaNumber.EQUAL_TO]: {
    label: '=',
  },
  [searchCriteriaNumber.GREATER_THAN]: {
    label: '>',
  },
  [searchCriteriaNumber.NOT_EQUAL_TO]: {
    label: '!=',
  },
};
