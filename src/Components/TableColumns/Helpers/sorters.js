import moment from 'moment';

export const sortAlpha = (a, b) => (b == null) - (a == null) || -(a > b) || +(a < b);
export const sortTime = (a, b) => (a == null) - (b == null) || -(moment(a).valueOf() > moment(b).valueOf()) || +(moment(a).valueOf() < moment(b).valueOf());
export const sortBoolean = (a, b) => a === b ? 0 : a ? -1 : 1;
