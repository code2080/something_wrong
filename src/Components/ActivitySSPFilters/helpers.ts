import { capitalize, compact, lowerCase, sortBy, uniq } from 'lodash';
import { Field } from 'Redux/TE/te.selectors';
import { TActivityFilterLookupMap } from 'Types/Activity/ActivityFilterLookupMap.type';
import { TGetExtIdPropsPayload } from 'Types/TECorePayloads.type';
import { REPLACED_KEY } from './constants';

export const getLabelsFromProp = {
  objects: (val) =>
    Object.entries(val).flatMap(([type, values]) => [
      { field: 'types', extId: type },
      ...Object.keys(values as any).map((v) => ({
        field: 'objects',
        extId: v,
      })),
    ]),
  objectFilters: (val) =>
    Object.entries(val).flatMap(([type, values]) => [
      { field: 'types', extId: type },
      ...Object.keys(values as any).map((v) => ({ field: 'fields', extId: v })),
    ]),
  fields: (val) => Object.keys(val).map((v) => ({ field: 'fields', extId: v })),
  primaryObject: (val) =>
    Object.keys(val).map((v) => ({ field: 'objects', extId: v })),
};

export const getTECorePayload = (
  filterMap: TActivityFilterLookupMap,
): TGetExtIdPropsPayload => {
  const labels: { field: Field; extId: string }[] = Object.entries(
    filterMap,
  ).flatMap(
    ([property, values]) => getLabelsFromProp[property]?.(values) ?? null,
  );
  return compact(labels).reduce<TGetExtIdPropsPayload>(
    (payload, label) => ({
      ...payload,
      [label.field]: uniq([...(payload[label.field] ?? []), label.extId]),
    }),
    { objects: [], fields: [], types: [] },
  );
};

export const parseKey = (key: string): string =>
  key.split('.').join(REPLACED_KEY);
export const reparseKey = (key: string): string =>
  key.split(REPLACED_KEY).join('.');

export const isObject = (obj: any): boolean =>
  !Array.isArray(obj) && typeof obj === 'object';

export const beautifyObject = (object: any) =>
  Object.keys(object).reduce(
    (results, key) => ({
      ...results,
      [parseKey(key)]: isObject(object[key])
        ? beautifyObject(object[key])
        : object[key],
    }),
    {},
  );

export const flattenObject = (object: any, parentKey: any, level: any) => {
  return Object.keys(object).reduce((results, key) => {
    const _key = compact([parentKey, key]).join('.');
    if (level && _key.split('.').length === level) {
      return {
        ...results,
        [_key]: object[key],
      };
    }

    if (isObject(object[key])) {
      return {
        ...results,
        ...flattenObject(object[key], _key, level),
      };
    }
    return {
      ...results,
      [_key]: object[key],
    };
  }, {});
};

export const toActivityStatusDisplay = (status: string): string =>
  capitalize(status).replace(/_/g, ' ');

export const filterFilterOptionsByQuery = (query: string, options: any[]) => {
  let retVal: any[] = [];
  if (!query || query === '') {
    retVal = [...options];
  } else {
    const lowercasedQuery = query.toLowerCase();
    retVal = options.filter((opt) =>
      lowerCase(`${opt.label} ${opt.value}`).includes(lowercasedQuery),
    );
  }
  const sortedArr = sortBy(retVal, [(o: any) => o.label]);
  return sortedArr;
};

/**
 * @function excludeEmptyKeysFromFilterLookupMap
 *
 * Recurisvely remove all leaf keys with values 'null', null, 'undefined', or undefined
 * Unless the key is present in the excludedKeys array
 * Usage is to tidy up a TFilterLookupMap object, and let the user see only the relevant filter options
 *
 * @param {TFilterLookupMap} obj
 * @param {string[]} excludedKeys
 * @returns {TFilterLookUpMap}
 */
export const excludeEmptyKeysFromFilterLookupMap = (
  obj: Record<any, any>,
  excludedKeys: string[],
) => {
  const sanitizedMap = Object.keys(obj || {}).reduce((nonEmptyKeys, key) => {
    // Get all the keys in the obj[key]
    const keysInKey = Object.keys(obj[key]);
    /**
     * If we only have one key, and its value is 'undefined', 'null', undefined, or null...
     */
    if (
      keysInKey.length === 1 &&
      (keysInKey[0] === 'undefined' ||
        keysInKey[0] === undefined ||
        keysInKey[0] === 'null' ||
        keysInKey[0] === null)
    ) {
      /**
       * ... then we return the obj as is without adding the key,
       * unless the key is in the excludedKeys array
       */
      if (!excludedKeys.includes(key)) {
        return nonEmptyKeys;
      } else {
        return {
          ...nonEmptyKeys,
          [key]: obj[key],
        };
      }
    }

    /**
     * Depending on whether the value (obj[key]) is an object or integer
     * we will recursively continue this function
     */
    return {
      ...nonEmptyKeys,
      [key]:
        typeof obj[key] === 'number'
          ? obj[key]
          : excludeEmptyKeysFromFilterLookupMap(obj[key], excludedKeys),
    };
  }, {});
  return sanitizedMap;
};

export const getAllFilterOptionsFromFilterLookupMap = (
  obj: {},
  prefix: string = '',
): Record<string, string[]> => {
  const flattenedMap = Object.keys(obj || {}).reduce((flatMap, key) => {
    // Get all the keys in the obj[key]
    const keysInKey = Object.keys(obj[key]);
    /**
     * Some type safety...
     */
    if (!keysInKey || !keysInKey[0]) return flatMap;

    /**
     * If keysInKey[0] === number, we will assume this is a leaf
     */
    if (typeof obj[key][keysInKey[0]] === 'number') {
      /**
       * This is a leaf (assuming key and value homogeniety in the obj...)
       * Turn it into an array and return
       */
      return {
        ...flatMap,
        [`${prefix}${key}`]: keysInKey.slice().sort((a: any, b: any) => a - b),
      };
    } else {
      /**
       * This is NOT a leaf, keep digging...
       */
      return {
        ...flatMap,
        ...getAllFilterOptionsFromFilterLookupMap(
          obj[key],
          `${prefix}${key}${REPLACED_KEY}`,
        ),
      };
    }
  }, {});
  return flattenedMap;
};

export const createPatchFromFilterPropertyAndValues = (
  selectedFilterProperty: string,
  values: string[],
) => {
  const keys = selectedFilterProperty.split(REPLACED_KEY);
  const reversedKeys = keys.reverse();
  const obj = reversedKeys.reduce((prev, current: string, idx) => {
    if (idx === 0) {
      return { [current]: [...values] };
    } else {
      return { [current.toString()]: { ...prev } };
    }
  }, {});
  return obj;
};

export const transformFilterValues = (
  obj: Record<string, any>,
  prefix = '',
): Record<string, any[]> => {
  const flattenedMap = Object.keys(obj || {}).reduce(
    (flatMap: Record<string, any[]>, key) => {
      if (Array.isArray(obj[key])) {
        return {
          ...flatMap,
          [key]: obj[key],
        };
      }

      // Get all the keys in the obj[key]
      const keysInKey = Object.keys(obj[key]);
      /**
       * Some type safety...
       */
      if (!keysInKey || !keysInKey[0]) return flatMap;

      /**
       * If keysInKey[0] === array, we will assume this is a leaf
       */
      if (Array.isArray(obj[key][keysInKey[0]])) {
        /**
         * This is a leaf (assuming key and value homogeniety in the obj...)
         */
        for (let i = 0; i < keysInKey.length; i += 1) {
          flatMap[`${prefix}${key}${REPLACED_KEY}${keysInKey[i]}`] =
            obj[key][keysInKey[i]];
        }
        return flatMap;
      } else {
        /**
         * This is NOT a leaf, keep digging...
         */
        return {
          ...flatMap,
          ...transformFilterValues(obj[key], `${prefix}${key}${REPLACED_KEY}`),
        };
      }
    },
    {},
  );
  return flattenedMap;
};
