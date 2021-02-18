import PropTypes from 'prop-types';

// HELPERS
import { minToHourMinDisplay } from '../../../../Utils/moment.helpers';

const LengthValue = ({ value }) => {
  const { days, hours, minutes } = minToHourMinDisplay(value);

  return days ? `${days}d, ${hours}:${minutes}` : `${hours}:${minutes}`;
};

LengthValue.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default LengthValue;
