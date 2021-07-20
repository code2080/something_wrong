import moment from 'moment';
import { TFilterLookUpMap } from 'Types/FilterLookUp.type';

import { SelectOption } from './FilterModal.type';
import FilterOptions from './FilterOptionsSelectbox';

export const convertToKeys = key => {
  const splitted = key.split('.');
  return [splitted[0], splitted.slice(1).join('.')];
};

export const generateSelectComponent = ({ title, name, label, parent }: {
  title: string,
  name: string,
  label: string,
  parent?: string,
}) => ({
  name,
  title,
  label,
  parent,
  render: (options?: SelectOption[]) => (
    <FilterOptions options={options} label={label} name={name} />
  ),
});

export const generateObjectItems = (filterLookupMap: TFilterLookUpMap, field: string) => {
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
}

export const validateFilterQuery = (values: any): any => {
  const { startTime, endTime, startDate, endDate } = values;
  const err: {
    [key: string]: string
   } = {};
  if (startTime && endTime && !moment(startTime).isBefore(moment(endTime))) {
    err.startTime = 'End time must be later then start time';
  }
  if (startDate && endDate && !moment(startDate).isBefore(moment(endDate))) {
    err.startDate = 'End date must be later then start date';
  }
  return err;
};
