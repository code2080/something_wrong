import React from 'react';
import PropTypes from 'prop-types';
import { Switch } from 'antd';

const Checkbox = ({ value }) => (
  <Switch size="small" checked={value || false} />
);

Checkbox.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};

Checkbox.defaultProps = {
  value: false,
};

export default Checkbox;
