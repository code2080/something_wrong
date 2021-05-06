import { weekdayEnums } from '../../../../Constants/weekDays.constants';

// TYPES
type Props = {
  value: string | null;
  extId: string;
  activityId: string;
};

const WeekdayValue = ({ value }: Props) =>
  value ? weekdayEnums[value] || 'N/A' : '';

export default WeekdayValue;
