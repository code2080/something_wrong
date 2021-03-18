import PropTypes from 'prop-types';

const standardizeValue = value => Array.isArray(value) ? value : [value];
const ObjectObjectValue = ({ value }) => {
  const stdValue = standardizeValue(value);
  const formattedValue = stdValue.join(', ');

  return formattedValue;
};

ObjectObjectValue.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
};

export default ObjectObjectValue;
