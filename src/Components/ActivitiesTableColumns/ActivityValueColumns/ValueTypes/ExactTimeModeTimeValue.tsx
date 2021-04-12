import moment from 'moment';
import { DATE_TIME_FORMAT } from '../../../../Constants/common.constants';

// TYPES
type Props = {
  value: string;
  extId: string;
  activityId: string;
};

const ExactTimeModeTimeValue = ({ value }: Props) => {
  const formattedValue = moment(value).utc().format(DATE_TIME_FORMAT);

  return formattedValue;
};

export default ExactTimeModeTimeValue;
