import { TFilterLookUpMap } from 'Types/DEPR_FilterLookUp.type';

import _, { capitalize, set } from 'lodash';

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

export const validateFilterQuery = (_values: any): any => {
  // TODO: Comment for now, may useful in future
  // const { startTime, endTime, startDate, endDate } = values;
  // const err: {
  //   [key: string]: string;
  // } = {};
  // if (startTime && endTime && !moment(startTime).isBefore(moment(endTime))) {
  //   err.startTime = 'End time must be later then start time';
  // }
  // if (startDate && endDate && !moment(startDate).isBefore(moment(endDate))) {
  //   err.startDate = 'End date must be later then start date';
  // }
  // return err;
  return null;
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
  return key.split('.').join(REPLACED_KEY);
};
export const reparseKey = (key) => {
  return key.split(REPLACED_KEY).join('.');
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

export const deBeautifyObject = (object) => {
  return Object.keys(object).reduce((results, key) => {
    if (isObject(object[key])) {
      return {
        ...results,
        [reparseKey(key)]: deBeautifyObject(object[key]),
      };
    }
    return {
      ...results,
      [reparseKey(key)]: object[key],
    };
  }, {});
};

export const deFlattenObject = (object) => {
  if (!object) return object;
  const results = {};
  Object.keys(object).forEach((key) =>
    set(results, key.split('.'), object[key]),
  );
  return deBeautifyObject(results);
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

export const toActivityStatusDisplay = (status: string) =>
  capitalize(status).replace(/_/g, ' ');
