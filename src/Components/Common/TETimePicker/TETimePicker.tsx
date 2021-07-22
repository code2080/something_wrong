import React, { useRef } from 'react';

import { TimePicker, TimePickerProps } from 'antd';
import { Moment } from 'moment';

interface Props extends TimePickerProps {}

export default (props: Props) => {
  const ref = useRef(null);
  const onSelect = (time: Moment) => {
    if (typeof props.onSelect === 'function') props.onSelect(time);
    if (typeof props.onChange === 'function')
      props.onChange(time, time.toJSON());
  };

  return <TimePicker ref={ref} {...props} onSelect={onSelect} />;
};
