import moment from 'moment';
import { TActivity } from '../../Types/Activity.type';
import { ActivityValue } from '../../Types/ActivityValue.type';
import {
  DATE_FORMAT,
  TIME_FORMAT,
  DATE_TIME_FORMAT,
} from '../../Constants/common.constants';
import { activityTimeModes } from '../../Constants/activityTimeModes.constants';
import { minToHourMinDisplay } from '../moment.helpers';
import { weekdayEnums } from '../../Constants/weekDays.constants';

import { determineTimeModeForActivity } from './helpers';

export const fvTimeSlotStartTimeValue = (
  activityValue: ActivityValue,
  activity: TActivity,
): any[] | null => {
  try {
    const endTime = activity.timing.find((el) => el.extId === 'endTime');
    const length = activity.timing.find((el) => el.extId === 'length');
    if (!endTime || !length || !activityValue.value) return null;
    const { value, extId } = activityValue;
    const fv = `${moment(value).format(DATE_FORMAT)} ${moment(value).format(
      TIME_FORMAT,
    )} - ${moment(endTime.value)
      .subtract(length.value, 'hours')
      .format(TIME_FORMAT)}`;
    return [{ value: `${extId}/${fv}`, label: fv }];
  } catch (error) {
    return null;
  }
};

export const fvTimeSlotEndTimeValue = (
  activityValue: ActivityValue,
  activity: TActivity,
): any[] | null => {
  try {
    const startTime = activity.timing.find((el) => el.extId === 'startTime');
    const length = activity.timing.find((el) => el.extId === 'length');
    if (!startTime || !length || !activityValue.value) return null;
    const { value, extId } = activityValue;
    const fv = `${moment(startTime.value).format(DATE_FORMAT)} ${moment(
      startTime.value,
    )
      .add(length.value, 'hours')
      .format(TIME_FORMAT)} - ${moment(value).format(TIME_FORMAT)}`;
    return [{ value: `${extId}/${fv}`, label: fv }];
  } catch (error) {
    return null;
  }
};

export const fvLengthValue = (activityValue: ActivityValue): any[] | null => {
  try {
    const { value, extId } = activityValue;
    const { days, hours, minutes } = minToHourMinDisplay(value);
    const fv = days ? `${days}d, ${hours}:${minutes}` : `${hours}:${minutes}`;
    return [{ value: `${extId}/${fv}`, label: fv }];
  } catch (error) {
    return null;
  }
};

export const fvDateRangesValue = (
  activityValue: ActivityValue,
): any[] | null => {
  try {
    const { value, extId } = activityValue;
    if (!value || !value.startTime) return null;
    const { startTime, endTime } = value;
    const fv = `${moment(startTime).format(DATE_FORMAT)} - ${moment(
      endTime,
    ).format(DATE_FORMAT)}`;
    return [{ value: `${extId}/${fv}`, label: fv }];
  } catch (error) {
    return null;
  }
};

export const fvPaddingValue = (activityValue: ActivityValue): any[] | null => {
  try {
    const { value, extId } = activityValue;
    // At least one padding variable is mandatory, otherwise null value (in itself not a failed validation)
    if (!value || (!value.before && !value.after))
      return [{ value: `${extId}/N/A`, label: 'N/A' }];
    const { before, after } = value;
    const b = minToHourMinDisplay(before);
    const a = minToHourMinDisplay(after);
    let fv;
    if (b && !a) {
      fv = `Before: ${
        b.days
          ? `${b.days}d, ${b.hours}:${b.minutes}`
          : `${b.hours}:${b.minutes}`
      }`;
    } else if (a && !b) {
      fv = `After: ${
        a.days
          ? `${a.days}d, ${a.hours}:${a.minutes}`
          : `${a.hours}:${a.minutes}`
      }`;
    } else {
      fv = `Before: ${
        b.days
          ? `${b.days}d, ${b.hours}:${b.minutes}`
          : `${b.hours}:${b.minutes}`
      }, after: ${
        a.days
          ? `${a.days}d, ${a.hours}:${a.minutes}`
          : `${a.hours}:${a.minutes}`
      }`;
    }
    return [{ value: `${extId}/${fv}`, label: fv }];
  } catch (error) {
    return null;
  }
};

export const fvExactTimeModeTimeValue = (
  activityValue: ActivityValue,
): any[] | null => {
  try {
    const { value, extId } = activityValue;
    if (value == null || value === undefined) return null;
    const fv = moment(value).format(DATE_TIME_FORMAT);
    return [{ value: `${extId}/${fv}`, label: fv }];
  } catch (error) {
    return null;
  }
};

export const fvTimeValue = (activityValue: ActivityValue): any[] | null => {
  try {
    const { value, extId } = activityValue;
    const fv = value ? moment(value).format(DATE_TIME_FORMAT) : 'N/A';
    return [{ value: `${extId}/${fv}`, label: fv }];
  } catch (error) {
    return null;
  }
};

export const fvWeekdayValue = (activityValue: ActivityValue): any[] | null => {
  try {
    const { value, extId } = activityValue;
    const fv = value ? weekdayEnums[value] : 'N/A';
    return [{ value: `${extId}/${fv}`, label: fv }];
  } catch (error) {
    return null;
  }
};

/**
 * @function getFVForTimingValue
 * @description Entry point for determining formatted value for a timing activity value type
 * @param {ActivityValue} activityValue
 * @param {Activity} activity
 * @returns string | null
 */
export const getFVForTimingValue = (
  activityValue: ActivityValue,
  activity: TActivity,
): any[] | null => {
  try {
    // Determine time mode
    const timeMode = determineTimeModeForActivity(activity);

    // CASE: start time and time slots
    if (
      activityValue.extId === 'startTime' &&
      timeMode === activityTimeModes.TIMESLOTS
    )
      return fvTimeSlotStartTimeValue(activityValue, activity);

    // CASE: end time and time slots
    if (
      activityValue.extId === 'endTime' &&
      timeMode === activityTimeModes.TIMESLOTS
    )
      return fvTimeSlotEndTimeValue(activityValue, activity);

    // CASE: length value for duration
    if (activityValue.extId === 'length') return fvLengthValue(activityValue);

    // CASE: dateRanges for sequence scheduling
    if (activityValue.extId === 'dateRanges')
      return fvDateRangesValue(activityValue);

    // CASE: padding
    if (activityValue.extId === 'padding') return fvPaddingValue(activityValue);

    // CASE: startTime, endTime in EXACT mode
    if (
      (activityValue.extId === 'startTime' ||
        activityValue.extId === 'endTime') &&
      timeMode === activityTimeModes.EXACT
    )
      return fvExactTimeModeTimeValue(activityValue);

    if (activityValue.extId === 'time') return fvTimeValue(activityValue);

    if (activityValue.extId === 'weekday') return fvWeekdayValue(activityValue);

    return null;
  } catch (error) {
    return null;
  }
};
