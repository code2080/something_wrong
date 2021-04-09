import PropTypes from 'prop-types';
import { selectMultipleExtIdLabels } from '../../../../Redux/TE/te.selectors';
import { useSelector } from 'react-redux';

// COMPONENTS
import EllipsisRenderer from '../../../TableColumns/Components/EllipsisRenderer';

const standardizeValue = (value) => (Array.isArray(value) ? value : [value]);
const ObjectObjectValue = ({ value }) => {
  const stdValue = standardizeValue(value);
  const labels = useSelector(selectMultipleExtIdLabels)(
    stdValue.map((val) => ({ field: 'objects', extId: val })),
  );
  const formattedValue = stdValue.map((val) => labels[val] || val).join(', ');
  return <EllipsisRenderer text={formattedValue} />;
};

ObjectObjectValue.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
};

export default ObjectObjectValue;
