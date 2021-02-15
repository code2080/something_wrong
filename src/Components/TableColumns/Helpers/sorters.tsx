import moment from 'moment';

export const sortAlpha = String.prototype.localeCompare;
export const sortTime = (a: number, b: number) =>
  -(moment(a).valueOf() > moment(b).valueOf()) ||
  +(moment(a).valueOf() < moment(b).valueOf());
export const sortBoolean = (a: boolean, b: boolean) =>
  a === b ? 0 : a ? -1 : 1;
