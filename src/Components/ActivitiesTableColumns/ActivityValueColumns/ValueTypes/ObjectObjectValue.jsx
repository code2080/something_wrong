import PropTypes from 'prop-types';

// COMPONENTS
import EllipsisRenderer from '../../../TableColumns/Components/EllipsisRenderer';

const standardizeValue = (value) => (Array.isArray(value) ? value : [value]);
const ObjectObjectValue = ({ value }) => {
  const stdValue = standardizeValue(value);
  const formattedValue = stdValue.join(', ');
  return <EllipsisRenderer text={formattedValue} />;
};

ObjectObjectValue.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
};

export default ObjectObjectValue;
