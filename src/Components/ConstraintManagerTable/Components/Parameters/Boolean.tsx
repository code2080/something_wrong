import React from 'react';
import { Switch } from 'antd';

// TYPES
type Props = {
  value: boolean;
  onChange: (value: boolean) => void;
};

const BooleanParameter = ({ value, onChange }: Props) => {
  return (
    <Switch
      size='small'
      checked={value}
      onChange={(checked) => onChange(checked)}
    />
  );
};

export default BooleanParameter;
