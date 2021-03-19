import { weekdayEnums } from '../../../../Constants/weekDays.constants';

// TYPES
type Props = {
  value: string;
  extId: string;
  activityId: string;
};

const WeekdayValue = ({ value }: Props) => {
  const formattedValue = value ? weekdayEnums[value] : 'N/A';

  return formattedValue;
};

export default WeekdayValue;
