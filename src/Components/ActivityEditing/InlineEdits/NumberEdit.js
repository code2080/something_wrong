import React from 'react';
import PropTypes from 'prop-types';
import { InputNumber } from 'antd';

const NumberEdit = ({ value, setValue, onFinish }) => (
  <InputNumber
    type="number"
    size="small"
    allowClear
    onPressEnter={() => onFinish()}
    value={value}
    placeholder="Type here"
    onChange={value => setValue(value)}
  />
);

NumberEdit.propTypes = {
  value: PropTypes.number,
  setValue: PropTypes.func.isRequired,
  onFinish: PropTypes.func.isRequired,
};

NumberEdit.defaultProps = {
  value: 0,
};

export default NumberEdit;
