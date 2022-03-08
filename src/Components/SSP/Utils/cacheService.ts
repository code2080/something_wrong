import { TActivityFilterQuery } from "Types/ActivityFilter.type";
import { TActivityFilter } from "Types/ActivityFilterLookupMap.type";
import { ISSPFilterQuery } from "Types/SSP.type";

const SSP_CACHE_PREFIX = 'te_ssp_';

export const getFilterCache = (datasourceId?: string): Partial<ISSPFilterQuery> => {
  if (!datasourceId) return {};
  const maybeFilterCache = localStorage.getItem(`${SSP_CACHE_PREFIX}filters_${datasourceId}`);
  if (!maybeFilterCache) return {};
  try {
    const parsedFilterCache = JSON.parse(maybeFilterCache);
    return parsedFilterCache;
  } catch (error) {
    console.error('Failed parsing filter cache');
    return {};
  }
};

export const setFilterCache = (datasourceId: string, filterQuery: Partial<ISSPFilterQuery>): void => {
  try {
    const serializedFilter = JSON.stringify(filterQuery);
    localStorage.setItem(`${SSP_CACHE_PREFIX}filters_${datasourceId}`, serializedFilter);
  } catch (error) {
    console.error('Failed stringifying filter cache');
  }
}