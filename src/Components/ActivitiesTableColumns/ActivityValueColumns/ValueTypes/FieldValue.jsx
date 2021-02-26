const FieldValue = ({ value, extId }) => {
  return Array.isArray(value) ? value.join(', ') : value;
};

export default FieldValue;
