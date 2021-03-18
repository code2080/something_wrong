import { ActivityValueType } from '../../Constants/activityValueTypes.constants';
import { TActivity } from '../../Types/Activity.type';
import { ActivityValue } from '../../Types/ActivityValue.type';
import { getFVForTimingValue } from './timing';
import { getFVForObjectValue } from './object';
import { getFVForFieldValue } from './field';

/**
 * Returns a normalized rendering payload including validation for all possible activityValue types
 * @param {ActivityValue} activityValue
 * @param {Activity} activity
 */
export const derivedFormattedValueForActivityValue = (activityValue: ActivityValue, activity: TActivity): any[] | null => {
  // Start by figuring out if we're dealing with a timing, object, or field value
  const type = activityValue.type;

  // Deal with the 3 different types in separate functions
  switch (type) {
    case ActivityValueType.TIMING:
      return getFVForTimingValue(activityValue, activity);
    case ActivityValueType.OBJECT:
      return getFVForObjectValue(activityValue);
    case ActivityValueType.FIELD:
      return getFVForFieldValue(activityValue);
  }
};
