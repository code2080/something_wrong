import PropTypes from 'prop-types';

// HELPERS
import { minToHourMinDisplay } from '../../../../Utils/moment.helpers';

const LengthValue = ({ value }) => {
  const { days, hours, minutes } = minToHourMinDisplay(value);

  const formattedValue = days ? `${days}d, ${hours}:${minutes}` : `${hours}:${minutes}`;

  return formattedValue;
};

LengthValue.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  extId: PropTypes.string.isRequired,
  activityId: PropTypes.string.isRequired,
};

export default LengthValue;
