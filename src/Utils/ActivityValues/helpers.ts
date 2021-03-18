import { ActivityValueType } from '../../Constants/activityValueTypes.constants';
import { TActivity } from '../../Types/Activity.type';
import { ActivityValue } from '../../Types/ActivityValue.type';
import { submissionValueTypes } from '../../Constants/submissionValueTypes.constants';

const filterTypes = {
  CATEGORIES: 'CATEGORIES',
  SEARCH_STRING: 'SEARCH_STRING',
};

/**
 * @function getTimeModeForActivity
 * @description Get timing mode (EXACT, TIMESLOTS, SEQUENCE) for activity
 * @param {Activity} activity
 * @returns string
 */
export const determineTimeModeForActivity = (activity: TActivity) => {
  try {
    const aV = activity.timing.find(el => el.extId === 'mode');
    return aV.value;
  } catch (error) {
    return null;
  }
};

/**
 * @function determineObjectValueContent
 * @description asserts which type of content the activityValue.value contains
 * @param {Object} activityValue the activity value to be assessed
 * @returns {String} value type (enum of submissionValueTypes)
 */
export const determineObjectValueContent = (activityValue: ActivityValue) => {
  if (activityValue.type !== ActivityValueType.OBJECT) return null;
  if (Array.isArray(activityValue.value)) return submissionValueTypes.OBJECT;
  return submissionValueTypes.FILTER;
};

/**
 * @function normalizeFilterValue
 * @description normalize a filter value to an array of { fieldExtId: String, value: JoinedString }
 * @param {*} value the filter value
 * @param {*} filterType the type of filter (SEARCH_STRING | CATEGORIES)
 * @returns array
 */
export const normalizeFilterValue = (value, filterType) => {
  switch (filterType) {
    case filterTypes.CATEGORIES:
      return value.categories.reduce((tot, acc) => {
        return [
          ...tot,
          { fieldExtId: acc.id, values: acc.values.join(', ') },
        ];
      }, []);
    case filterTypes.SEARCH_STRING:
    default: {
      const { searchFields, searchString } = value;
      if (!searchFields || !searchString) return null;
      return [{ fieldExtId: searchFields, values: searchString }];
    };
  }
};

/**
 * @function normalizeFilterValues
 * @description normalize a full array of filter values
 * @param {*} value the filter values
 * @returns array
 */
export const normalizeFilterValues = (value: any[]) => {
  const normalizedValues = value.reduce((tot, acc) => {
    const filterType = acc.categories.length ? filterTypes.CATEGORIES : filterTypes.SEARCH_STRING;
    const normalizedFilterValue = normalizeFilterValue(acc, filterType);
    if (normalizedFilterValue) return [...tot, ...normalizedFilterValue];
    return tot;
  }, []);
  return normalizedValues;
};
