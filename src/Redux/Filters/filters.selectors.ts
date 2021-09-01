import { createSelector } from 'reselect';
import _, { isEqual, omit } from 'lodash';
import {
  EActivityFilterInclusion,
  EActivityFilterMode,
} from '../../Types/ActivityFilter.interface';
import { TActivity } from '../../Types/Activity.type';
import { TFilterLookUpMap } from '../../Types/FilterLookUp.type';
import { TActivityFilterQuery } from '../../Types/ActivityFilter.type';
import { isEmptyDeep } from 'Utils/general.helpers';
import { deFlattenObject } from 'Components/ActivityFiltering/FilterModal/FilterModal.helper';
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

export const selectActivityFilterOptionsForForm = createSelector(
  filterstate,
  (filters) => (formId: string) => {
    if (!filters || !filters[`${formId}_ACTIVITIES_OPTIONS`]) return {};
    return filters[`${formId}_ACTIVITIES_OPTIONS`];
  },
);

export const selectActivityFilterForForm = createSelector(
  filterstate,
  (filters) => (formId: string) => {
    if (!filters || !filters[`${formId}_ACTIVITIES`]) return {};
    return filters[`${formId}_ACTIVITIES`];
  },
);

export const selectActivityFilterModeForForm = createSelector(
  filterstate,
  (filters) => (formId: string) => {
    const settings = filters[`${formId}_ACTIVITIES_SETTINGS`];
    if (!settings || !settings.mode) return EActivityFilterMode.some;
    return settings.mode;
  },
);

export const selectActivityFilterInclusionForForm = createSelector(
  filterstate,
  (filters) => (formId: string) => {
    const settings = filters[`${formId}_ACTIVITIES_SETTINGS`];
    if (!settings || !settings.inclusion)
      return EActivityFilterInclusion.SINGLE;
    return settings.inclusion;
  },
);

export const selectVisibleActivitiesForForm = createSelector(
  (state: any) => state,
  (state) => (formId: string) => {
    const filters = state.filters;
    const filterValues = filters[`${formId}_ACTIVITIES`];
    const filterMatches = filters[`${formId}_ACTIVITIES_MATCHES`];
    const filterSettings = filters[`${formId}_ACTIVITIES_SETTINGS`];
    const filterMode =
      filterSettings && filterSettings.mode
        ? filterSettings.mode
        : EActivityFilterMode.some;
    const filterInclusion =
      filterSettings && filterSettings.inclusion
        ? filterSettings.inclusion
        : EActivityFilterInclusion.SINGLE;

    if (!filters) return [];
    if (!filterMatches || !filterValues) return 'ALL';
    // Reduce over filter values to get one large array
    const validValues = Object.keys(filterValues).reduce(
      (tot: string[], extId: string) => [...tot, ...filterValues[extId]],
      [],
    );
    if (!validValues || !validValues.length) return 'ALL';

    // We need to get all filter matches for the valid values...
    const activitiesMatchingValidValues = validValues
      .filter((el) => filterMatches[el] != null)
      .map((el) => filterMatches[el]);

    // Now, all we need to do is return if an activityId exists in one or all of the sub arrays
    const activitiesMatchingCriteria = activitiesMatchingValidValues.reduce(
      (tot, acc) => {
        // Here we should basically add all activity ids from acc, ensuring we keep a unique array
        if (filterMode === EActivityFilterMode.some)
          return _.uniq([...tot, ...acc]);
        /**
         * Here, unless tot is empty, we should only add the values from acc that already exists in tot,
         * and also remove the values from tot that don't exist in acc
         */
        if (!tot || !tot.length) return [...acc];
        return _.intersection(tot, acc);
      },
      [],
    );

    if (filterInclusion === EActivityFilterInclusion.SINGLE)
      return activitiesMatchingCriteria;

    // If inclusion === SUBMISSION, we should return all activities on the submissions where we find the visible activities
    const submissions = state.activities[formId] || {};
    return _(Object.values(submissions))
      .filter((act: TActivity) => activitiesMatchingCriteria.includes(act))
      .map((act: TActivity) => act._id)
      .uniq()
      .value();
  },
);

export const selectFilterIsActivated = (formId: string) =>
  createSelector(filterstate, (filters) => {
    const formFilterQueries = filters[formId]?.filterValues;
    if (!formFilterQueries) return false;
    if (isEqual(formFilterQueries, INITIAL_FILTER_VALUES)) return false;
    return !isEmptyDeep(formFilterQueries);
  });
