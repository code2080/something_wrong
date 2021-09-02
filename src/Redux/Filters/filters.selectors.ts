import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import omitBy from 'lodash/omitBy';
import isEqual from 'lodash/isEqual';

import { TFilterLookUpMap } from '../../Types/FilterLookUp.type';
import { TActivityFilterQuery } from '../../Types/ActivityFilter.type';
import { isEmptyDeep } from 'Utils/general.helpers';
import { INITIAL_FILTER_VALUES } from 'Components/ActivityFiltering/FilterModal/FilterModal.constants';

const filterstate = (state) => state.filters;

export const makeSelectSelectedFilterValues = () =>
  createSelector(
    filterstate,
    (_, formId: string) => formId,
    (filters, formId): TActivityFilterQuery => {
      if (!filters || !formId) return {} as TActivityFilterQuery;
      return filters[formId]?.filterValues ?? ({} as TActivityFilterQuery);
    },
  );

export const makeSelectFormLookupMap = () =>
  createSelector(
    filterstate,
    (_, formId: string) => formId,
    (filters, formId): TFilterLookUpMap => {
      if (!filters || !formId) return {} as TFilterLookUpMap;
      return filters[formId]?.filterLookup ?? ({} as TFilterLookUpMap);
    },
  );

export const selectFilter = createSelector(
  filterstate,
  (filters) =>
    (filterId, filterInterface = {}) => {
      if (!filters) return filterInterface;
      const f = filters[filterId];
      return {
        ...filterInterface,
        ...(f || {}),
      };
    },
);

export const selectFilterIsActivated = (formId: string) =>
  createSelector(filterstate, (filters) => {
    const formFilterQueries = omitBy(filters[formId]?.filterValues, (val) =>
      isEmpty(val),
    );
    if (!formFilterQueries) return false;
    if (isEqual(formFilterQueries, INITIAL_FILTER_VALUES)) return false;
    return !isEmptyDeep(formFilterQueries);
  });
