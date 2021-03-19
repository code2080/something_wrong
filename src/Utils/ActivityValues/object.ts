import { determineObjectValueContent, normalizeFilterValues } from './helpers';
import { submissionValueTypes } from '../../Constants/submissionValueTypes.constants';
import { ActivityValue } from '../../Types/ActivityValue.type';

export const fvObjectFilterValue = (activityValue: ActivityValue) => {
  const { value, extId } = activityValue;
  const _value = Array.isArray(value) ? value : [value];
  const normalizedFilterValues = normalizeFilterValues(_value);
  return normalizedFilterValues.reduce((tot, acc) => {
    return {
      ...tot,
      [acc.fieldExtId]: [
        ...(tot[acc.fieldExtId] || []),
        ...(Array.isArray(acc.values)
          ? acc.values.map((el) => ({
              label: el,
              value: `${extId}/${acc.fieldExtId}/${el}`,
            }))
          : [
              {
                label: acc.values,
                value: `${extId}/${acc.fieldExtId}/${acc.values}`,
              },
            ]),
      ],
    };
  }, {});
};

export const fvObjectObjectValue = (activityValue: ActivityValue) => {
  const { value, extId } = activityValue;
  if (!value || value == null) return null;
  const _value = Array.isArray(value) ? value : [value];
  return _value.map((el) => ({ value: `${extId}/${el}`, label: el }));
};

/**
 * @function getFVForObjectValue
 * @description Entry point for deriving all object formatted values
 * @param {ActivityValue} activityValue
 * @param {Activity} activity
 * @returns string[] | null
 */
export const getFVForObjectValue = (
  activityValue: ActivityValue,
): any[] | null => {
  // Determine whether this object activity value contains a filter or objects
  const valueContainsValueOfType = determineObjectValueContent(activityValue);
  if (valueContainsValueOfType === submissionValueTypes.FILTER)
    return fvObjectFilterValue(activityValue);

  if (valueContainsValueOfType === submissionValueTypes.OBJECT)
    return fvObjectObjectValue(activityValue);

  return null;
};
