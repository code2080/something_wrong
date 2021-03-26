import PropTypes from 'prop-types';
import { Switch } from 'antd';

// STYLES
import './ElementBase.scss';

const Checkbox = ({ value }) => (
  <div className='element--wrapper'>
    <Switch size='small' checked={value || false} />
  </div>
);

Checkbox.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};

Checkbox.defaultProps = {
  value: false,
};

export default Checkbox;
