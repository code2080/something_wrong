import { ActivityValue } from '../../Types/ActivityValue.type';

export const getFVForFieldValue = (
  activityValue: ActivityValue,
): any[] | null => {
  const { value, extId } = activityValue;
  if (value == null) return null;
  const formattedValue = Array.isArray(value) ? value.join(', ') : value;
  return [{ value: `${extId}/${formattedValue}`, label: formattedValue }];
};
