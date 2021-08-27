import React, { useRef } from 'react';

import { TimePicker, TimeRangePickerProps } from 'antd';

interface Props extends TimeRangePickerProps {}

const getValues = (container: HTMLElement) => {
  const inputs = container.querySelectorAll('input');
  console.log(inputs);
  const values = [
    inputs[0] ? inputs[0].value : null,
    inputs[1] ? inputs[1].value : null,
  ];
  return values;
};

export default (props: Props) => {
  const ref = useRef(null);
  const onBlur = (e) => {
    const values = getValues(e.target.closest('.ant-picker-range'));
    console.log(values);
  };

  return <TimePicker.RangePicker ref={ref} {...props} onBlur={onBlur} />;
};
