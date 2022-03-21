import moment from 'moment';
import PropTypes from 'prop-types';
import { DATE_FORMAT } from '../../Constants/common.constants';

const dateTimeRenderer = (value, format) => {
  if (!moment(value).isValid()) return null;
  return moment(value).format(format);
};
const DateTime = ({ value, format }) => {
  if (Array.isArray(value))
    return value.map((val) => dateTimeRenderer(val, format)).join(' - ');
  return dateTimeRenderer(value, format);
};

DateTime.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  format: PropTypes.string,
};
DateTime.defaultProps = {
  value: null,
  format: DATE_FORMAT,
};

export default DateTime;
