import PropTypes from 'prop-types';

const FieldValue = ({ value }) => {
  const formattedValue = Array.isArray(value) ? value.join(', ') : value;
  return formattedValue || null;
};

FieldValue.propTypes = {
  value: PropTypes.any,
  extId: PropTypes.string.isRequired,
  activityId: PropTypes.string.isRequired,
};

export default FieldValue;
