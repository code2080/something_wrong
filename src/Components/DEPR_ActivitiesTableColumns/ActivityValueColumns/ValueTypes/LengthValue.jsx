import PropTypes from 'prop-types';
import { compact } from 'lodash';

// HELPERS
import { minToHourMinDisplay } from '../../../../Utils/moment.helpers';

const convertToLengthValue = (value) => {
  const { days, hours, minutes } = minToHourMinDisplay(value);

  const formattedValue = days
    ? `${days}d, ${hours}:${minutes}`
    : `${hours}:${minutes}`;

  return formattedValue;
};
const LengthValue = ({ value }) => {
  const _value = Array.isArray(value) ? value : [value];
  return compact(_value)
    .map((val) => convertToLengthValue(val))
    .join(', ');
};

LengthValue.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  extId: PropTypes.string.isRequired,
  activityId: PropTypes.string.isRequired,
};

export default LengthValue;
