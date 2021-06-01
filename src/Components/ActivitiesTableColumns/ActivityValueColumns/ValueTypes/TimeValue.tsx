import moment from 'moment';
import { TIME_FORMAT } from '../../../../Constants/common.constants';

// TYPES
type Props = {
  value: string;
};

const TimeValue = ({ value }: Props) =>
  value
    ? moment().startOf('day').add(value, 'minutes').format(TIME_FORMAT)
    : 'N/A';

export default TimeValue;
