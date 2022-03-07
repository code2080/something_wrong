import PropTypes from 'prop-types';

const FieldValue = ({ value }) => {
  if (!Array.isArray(value) && value instanceof Object) return null;
  const formattedValue = Array.isArray(value) ? value.join(', ') : value;
  if (formattedValue && typeof formattedValue === 'object')
    return JSON.stringify(formattedValue);
  return formattedValue || null;
};

FieldValue.propTypes = {
  value: PropTypes.any,
  extId: PropTypes.string.isRequired,
  activityId: PropTypes.string.isRequired,
};

export default FieldValue;
