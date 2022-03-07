import { capitalize, compact, uniq } from "lodash";
import { Field } from "Redux/TE/te.selectors";
import { TActivityFilterLookupMap } from "Types/ActivityFilterLookupMap.type";
import { TGetExtIdPropsPayload } from "Types/TECorePayloads.type";
import { REPLACED_KEY } from "./constants";

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
  const labels: { field: Field; extId: string }[] =
    Object.entries(filterMap).flatMap(
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

export const parseKey = (key: string): string => key.split('.').join(REPLACED_KEY);
export const reparseKey = (key: string): string => key.split(REPLACED_KEY).join('.');

export const isObject = (obj: any): boolean => !Array.isArray(obj) && typeof obj === 'object';

export const beautifyObject = (object: any) => 
  Object.keys(object).reduce((results, key) => ({
      ...results,
      [parseKey(key)]: isObject(object[key]) ? beautifyObject(object[key]) : object[key],
  }),
  {});

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