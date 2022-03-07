import { compact, isEmpty } from 'lodash';
import moment from 'moment';
import { TIME_FORMAT } from '../../../../Constants/common.constants';

// TYPES
type Props = {
  value: string;
};

const convertToTimeValue = (value) => {
  const parsedValue = moment(value, 'YYYY-MM-DDTHH:mm:ss.SSSZ', true);
  const formattedValue = parsedValue.isValid()
    ? parsedValue
    : moment().startOf('day').add(value, 'minutes');
  return value ? formattedValue.format(TIME_FORMAT) : 'N/A';
};

const TimeValue = ({ value }: Props) => {
  const _value = Array.isArray(value) ? value : [value];
  if (isEmpty(_value)) return 'N/A';
  return compact(_value.map((val) => convertToTimeValue(val))).join(', ');
};

export default TimeValue;
