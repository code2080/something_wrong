import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';
import pick from 'lodash/pick';
import omitBy from 'lodash/omitBy';
import isEqual from 'lodash/isEqual';

import { isEmptyDeep } from 'Utils/general.helpers';
import { INITIAL_FILTER_VALUES } from 'Components/DEPR_ActivityFiltering/FilterModal/FilterModal.constants';
import { TFilterLookUpMap } from '../../Types/DEPR_FilterLookUp.type';
import { TActivityFilterQuery } from '../../Types/DEPR_ActivityFilter.type';
import { ACTIVITIES_TABLE } from 'Constants/tables.constants';

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

export const selectFilterIsActivated = (formId: string, tableType?: string) =>
  createSelector(filterstate, (filters) => {
    const formFilterQueries = filters[`${formId}${tableType || ''}`];

    const jointTeachingSettings = pick(
      INITIAL_FILTER_VALUES,
      'settings.jointTeaching',
    );
    const filterSettings = omit(
      INITIAL_FILTER_VALUES,
      'settings.jointTeaching',
    );

    const formFilterQueriesWithoutSettings = omitBy(
      formFilterQueries,
      (val, property) =>
        isEmpty(val) || Object.keys(filterSettings).includes(property),
    );
    if (!formFilterQueriesWithoutSettings) return false;
    if (isEqual(formFilterQueriesWithoutSettings, jointTeachingSettings))
      return false;
    return !isEmptyDeep(formFilterQueriesWithoutSettings);
  });

export const selectSelectedFilterValues = ({ formId, origin = '' }) =>
  createSelector(filterstate, (filters) => {
    const selectedFilterValues = filters[`${formId}${origin}`];
    return (
      selectedFilterValues ??
      (origin === ACTIVITIES_TABLE
        ? (INITIAL_FILTER_VALUES as any)
        : (omit(INITIAL_FILTER_VALUES, 'status') as any))
    );
  });

export const selectFilterValueForSubmissions = ({ formId }) =>
  createSelector(filterstate, (filters) => {
    return filters[`${formId}_SUBMISSIONS`];
  });
