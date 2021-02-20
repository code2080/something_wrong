import moment from 'moment';

export const sortAlpha = (a: string | null, b: string | null) => {
  if (a == null) {
    return -1;
  }
  else if (b == null) {
    return 1;
  }
  else {
    return String.prototype.localeCompare.call(a, b);
  }

}
export const sortTime = (a: number, b: number) =>
  -(moment(a).valueOf() > moment(b).valueOf()) ||
  +(moment(a).valueOf() < moment(b).valueOf());
export const sortBoolean = (a: boolean, b: boolean) =>
  a === b ? 0 : a ? -1 : 1;
