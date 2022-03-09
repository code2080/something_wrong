import { ISSPFilterQuery, ISSPReducerState } from 'Types/SSP.type';

const SSP_CACHE_PREFIX = 'te_ssp_';
const MAX_STATE_CACHE_DEPTH = 10;

export const getFilterCache = (
  datasourceId?: string,
): Partial<ISSPFilterQuery> => {
  if (!datasourceId) return {};
  const maybeFilterCache = localStorage.getItem(
    `${SSP_CACHE_PREFIX}filters_${datasourceId}`,
  );
  if (!maybeFilterCache) return {};
  try {
    const parsedFilterCache = JSON.parse(maybeFilterCache);
    return parsedFilterCache;
  } catch (error) {
    console.error('Failed parsing filter cache');
    return {};
  }
};

export const setFilterCache = (
  datasourceId: string,
  filterQuery: Partial<ISSPFilterQuery>,
): void => {
  try {
    const serializedFilter = JSON.stringify(filterQuery);
    localStorage.setItem(
      `${SSP_CACHE_PREFIX}filters_${datasourceId}`,
      serializedFilter,
    );
  } catch (error) {
    console.error('Failed stringifying filter cache');
  }
};

export const getStateCache = (
  datasourceId: string,
  hash: number,
): Partial<Omit<ISSPReducerState, 'loading' | 'hasErrors'>> | undefined => {
  const maybeStateCache = localStorage.getItem(
    `${SSP_CACHE_PREFIX}state_${datasourceId}`,
  );
  if (!maybeStateCache) return undefined;
  try {
    const parsedStateCache = JSON.parse(maybeStateCache);
    const cachedElement = parsedStateCache.find(
      (el: any) => el.hash.toString() === hash.toString(),
    );
    if (!cachedElement) return undefined;
    return cachedElement.state;
  } catch (error) {
    console.error('Failed parsing state cache');
    return undefined;
  }
};

export const setStateCache = (
  datasourceId: string,
  hash: number,
  state: Partial<Omit<ISSPReducerState, 'loading' | 'hasErrors'>>,
) => {
  // Retrieve the current cache
  const unparsedStateCache =
    localStorage.getItem(`${SSP_CACHE_PREFIX}state_${datasourceId}`) || '[]';
  try {
    // Parse it
    const parsedStateCache = JSON.parse(unparsedStateCache);
    const updCache = [...parsedStateCache];
    // Add the new element
    updCache.push({ hash, state });
    // Count the number of entries
    if (updCache.length > MAX_STATE_CACHE_DEPTH) updCache.shift();
    // Serialize the array
    const serializedCache = JSON.stringify(updCache);
    localStorage.setItem(
      `${SSP_CACHE_PREFIX}state_${datasourceId}`,
      serializedCache,
    );
  } catch (error) {
    console.error('Failed setting state cache');
  }
};
