import React from 'react';
import { InputNumber } from 'antd';

// TYPES
type Props = {
  value: number | undefined,
  onChange: (value: number | undefined) => void,
};

const NumberParameter = ({ value, onChange }: Props) => {
  return (
    <InputNumber size='small' value={value} onChange={value => onChange(value)} />
  );
};

export default NumberParameter;
