import { isEmpty } from 'lodash';

export const isEmptyDeep = (data: any) => {
  if (typeof data !== 'object') return !data;
  if (isEmpty(data)) return true;
  if (Object.keys(data).includes('values')) return isEmptyDeep(data.values);
  return Object.keys(data).every((key: string) => {
    return isEmptyDeep(data[key]);
  });
};
