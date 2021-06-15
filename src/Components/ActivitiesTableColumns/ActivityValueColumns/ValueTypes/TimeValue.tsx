import moment from 'moment';
import { TIME_FORMAT } from '../../../../Constants/common.constants';

// TYPES
type Props = {
  value: string;
};

const TimeValue = ({ value }: Props) => {
  const parsedValue = moment(value, 'YYYY-MM-DDTHH:mm:ss.SSSZ', true);
  const formattedValue = parsedValue.isValid()
    ? parsedValue
    : moment().startOf('day').add(value, 'minutes');
  return value ? formattedValue.format(TIME_FORMAT) : 'N/A';
};

export default TimeValue;
