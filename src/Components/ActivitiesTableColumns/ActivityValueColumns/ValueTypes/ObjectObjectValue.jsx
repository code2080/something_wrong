import PropTypes from 'prop-types';

const ObjectObjectValue = ({ value }) => {
  const formattedValue = Array.isArray(value) ? value.join(', ') : value;
  return formattedValue;
};

ObjectObjectValue.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
};

export default ObjectObjectValue;
