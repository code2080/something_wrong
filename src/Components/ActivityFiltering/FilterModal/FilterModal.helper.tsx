import moment from 'moment';
import { TFilterLookUpMap } from 'Types/FilterLookUp.type';

import _, { set } from 'lodash';

import { SelectOption } from './FilterModal.type';
import FilterOptions from './FilterOptionsSelectbox';

import { REPLACED_KEY } from './FilterModal.constants';

export const convertToKeys = (key) => {
  const splitted = key.split('.');
  return [splitted[0], splitted.slice(1).join('.')];
};

export const generateSelectComponent = ({
  title,
  name,
  label,
  parent,
}: {
  title: string;
  name: string;
  label: string;
  parent?: string;
}) => ({
  name,
  title,
  label,
  parent,
  render: (options?: SelectOption[]) => (
    <FilterOptions options={options} label={label} name={name} />
  ),
});

export const generateObjectItems = (
  filterLookupMap: TFilterLookUpMap,
  field: string,
) => {
  return Object.keys(filterLookupMap[field] || {}).reduce((results, key) => {
    const _key = `${field}.${key}`;
    return {
      ...results,
      [_key]: generateSelectComponent({
        title: key,
        name: _key,
        label: key,
        parent: field,
      }),
    };
  }, {});
};

export const validateFilterQuery = (values: any): any => {
  const { startTime, endTime, startDate, endDate } = values;
  const err: {
    [key: string]: string;
  } = {};
  if (startTime && endTime && !moment(startTime).isBefore(moment(endTime))) {
    err.startTime = 'End time must be later then start time';
  }
  if (startDate && endDate && !moment(startDate).isBefore(moment(endDate))) {
    err.startDate = 'End date must be later then start date';
  }
  return err;
};

export const supportedFields = [
  'submitter',
  'tag',
  'primaryObject',
  'objectFilters',
  'objects',
  'filters',
  'fields',
  'startTime',
  'endTime',
  'startDate',
  'endDate',
];

export const parseKey = (key) => {
  return key.replaceAll('.', REPLACED_KEY);
};
export const reparseKey = (key) => {
  return key.replaceAll(REPLACED_KEY, '.');
};

export const isObject = (obj) => !Array.isArray(obj) && typeof obj === 'object';

export const beautifyObject = (object) => {
  return Object.keys(object).reduce((results, key) => {
    if (isObject(object[key])) {
      return {
        ...results,
        [parseKey(key)]: beautifyObject(object[key]),
      };
    }
    return {
      ...results,
      [parseKey(key)]: object[key],
    };
  }, {});
};

export const deBeatifyObject = (object) => {
  return Object.keys(object).reduce((results, key) => {
    if (isObject(object[key])) {
      return {
        ...results,
        [reparseKey(key)]: deBeatifyObject(object[key]),
      };
    }
    return {
      ...results,
      [reparseKey(key)]: object[key],
    };
  }, {});
};

export const deFlattenObject = (object) => {
  const results = {};
  Object.keys(object).forEach((key) =>
    set(results, key.split('.'), object[key]),
  );
  return deBeatifyObject(results);
};
export const flattenObject = (object, parentKey, level) => {
  return Object.keys(object).reduce((results, key) => {
    const _key = _.compact([parentKey, key]).join('.');
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
