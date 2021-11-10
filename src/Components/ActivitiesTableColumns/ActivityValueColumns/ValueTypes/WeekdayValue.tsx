import { compact, isEmpty } from 'lodash';
import { weekdayEnums } from '../../../../Constants/weekDays.constants';

// TYPES
type Props = {
  value: string | null;
  extId: string;
  activityId: string;
};

const WeekdayValue = ({ value }: Props) => {
  const _value = Array.isArray(value) ? value : [value];
  if (isEmpty(compact(_value))) return 'N/A';
  return compact(_value).map((val) => weekdayEnums[val]);
};

export default WeekdayValue;
