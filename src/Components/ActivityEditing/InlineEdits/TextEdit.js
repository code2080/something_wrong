import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';

const TextEdit = ({ value, setValue, onFinish }) => (
  <Input
    size='small'
    allowClear
    onPressEnter={() => onFinish()}
    value={value}
    placeholder='Type here'
    onChange={e => setValue(e.target.value)}
  />
);

TextEdit.propTypes = {
  value: PropTypes.string,
  setValue: PropTypes.func.isRequired,
  onFinish: PropTypes.func.isRequired,
};

TextEdit.defaultProps = {
  value: '',
};

export default TextEdit;
