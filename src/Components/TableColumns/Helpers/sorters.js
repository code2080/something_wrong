import moment from 'moment';

export const sortAlpha = (a, b) => ((lowerA, lowerB) => (lowerB == null) - (lowerA == null) || -(lowerA > lowerB) || +(lowerA < lowerB))(a.toLowerCase(), b.toLowerCase());
export const sortTime = (a, b) => (a == null) - (b == null) || -(moment(a).valueOf() > moment(b).valueOf()) || +(moment(a).valueOf() < moment(b).valueOf());
export const sortBoolean = (a, b) => a === b ? 0 : a ? -1 : 1;
