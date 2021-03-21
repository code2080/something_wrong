import moment from 'moment';
import React, { useState } from 'react';
import DateTimeEdit from './DateTimeEdit';

export default {
  title: 'Activity Manager/Components/ActivityEditing/InlineEdit/Time Edit',
  component: DateTimeEdit,
  argTypes: {},
};

export const TimeEdit = (args) => {
  const [value, setValue] = useState(moment());
  return <DateTimeEdit value={value} setValue={setValue} {...args} />;
};

TimeEdit.args = { onFinish: () => console.log('finished') };
