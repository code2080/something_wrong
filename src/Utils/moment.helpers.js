import moment from 'moment';

/**
 * Converts a number of minutes to days, hours, minutes
 * @param {Number} totalMin
 * @returns string
 */
export const minToHourMinDisplay = totalMin => {
  const minutes = totalMin % 60;
  const totalHours = (totalMin - minutes) / 60;
  const days = Math.max(Math.ceil(totalHours / 24) - 1, 0);
  const hours = totalHours - days * 24;
  return {
    minutes: minutes < 10 ? `0${minutes}` : minutes,
    hours,
    days,
  };
};

/**
 * @function getLocalDate
 * @description selects all the activities for a form instance
 * @param {moment} startTime start of the date
 * @param {moment} endTime end of the date
 * @returns {moment} localDate
 */
export const getLocalDate = (value) => {
  if (!value) return null;
  if (typeof value === 'string') return moment.utc(value);
  const { startTime, endTime } = value;
  if (!startTime || !endTime) return null;
  const momentStart = moment.utc(startTime);
  const momentEnd = moment.utc(endTime);
  return moment((momentStart.valueOf() + momentEnd.valueOf()) / 2);
};
