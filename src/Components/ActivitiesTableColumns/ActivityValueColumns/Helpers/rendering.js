import { activityValueStatuses } from '../../../../Constants/activityStatuses.constants';
import { activityValueTypes } from '../../../../Constants/activityValueTypes.constants';
import { submissionValueTypes } from '../../../../Constants/submissionValueTypes.constants';

// RENDERING HELPERS
import { renderTimingComponent } from './timingValueRendering';
import { renderObjectComponent } from './objectValueRendering';
import { renderFieldComponent } from './fieldValueRendering';
import { ActivityValueRenderPayload } from './RenderPayload';

// CONSTANTS
const filterTypes = {
  CATEGORIES: 'CATEGORIES',
  SEARCH_STRING: 'SEARCH_STRING',
};

/**
 * Returns a normalized rendering payload including validation for all possible activityValue types
 * @param {ActivityValue} activityValue
 * @param {Activity} activity
 */
export const renderComponent = (activityValue, activity) => {
  // Start by figuring out if we're dealing with a timing, object, or field value
  const type = activityValue.type;

  // Deal with the 3 different types in separate functions
  switch (type) {
    case activityValueTypes.TIMING:
      return renderTimingComponent(activityValue, activity);
    case activityValueTypes.OBJECT:
      return renderObjectComponent(activityValue, activity);
    case activityValueTypes.FIELD:
      return renderFieldComponent(activityValue, activity);
    default:
      return ActivityValueRenderPayload.create({
        status: activityValueStatuses.MISSING_DATA,
        errorMessage: 'Activity value type is incorrect',
      });
  }
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
}

/**
 * @function normalizeFilterValues
 * @description normalize a full array of filter values
 * @param {*} value the filter values
 * @returns array
 */
export const normalizeFilterValues = value => {
  const _value = Array.isArray(value) ? value : [value];
  const normalizedValues = _value.reduce((tot, acc) => {
    const filterType = acc.categories.length ? filterTypes.CATEGORIES : filterTypes.SEARCH_STRING;
    const normalizedFilterValue = normalizeFilterValue(acc, filterType);
    if (normalizedFilterValue) return [...tot, ...normalizedFilterValue];
    return tot;
  }, []);
  return normalizedValues;
};

/**
 * @function renderSubmissionValue
 * @description returns a formatted submission value for html output
 * @param {Array} submissionValue the submission value(s)
 * @param {String} submissionValueType the submission value type
 * @returns {Array} formattedSubmissionValues
 */
export const renderSubmissionValue = (submissionValue, submissionValueType) => {
  if (submissionValueType === submissionValueTypes.FILTER) {
    return normalizeFilterValues(submissionValue);
  }
  return submissionValue;
};
