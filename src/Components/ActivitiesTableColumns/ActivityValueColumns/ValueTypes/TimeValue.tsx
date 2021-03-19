import moment from 'moment';
import { DATE_TIME_FORMAT } from '../../../../Constants/common.constants';

// TYPES
type Props = {
  value: string;
  extId: string;
  activityId: string;
};

const TimeValue = ({ value }: Props) => {
  const formattedValue = value ? moment(value).format(DATE_TIME_FORMAT) : 'N/A';

  return formattedValue;
};

export default TimeValue;
