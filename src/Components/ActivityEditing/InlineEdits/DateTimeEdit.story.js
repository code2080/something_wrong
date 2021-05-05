import moment from 'moment';
import { useState } from 'react';
import DateTimeEdit from './DateTimeEdit';

export default {
  title: 'Activity Manager/Components/ActivityEditing/InlineEdit/Time Edit',
  component: DateTimeEdit,
  argTypes: {},
};

export const TimeEdit = (args) => {
  const [value, setValue] = useState(moment());
  return <DateTimeEdit {...args} value={value} setValue={setValue} />;
};

TimeEdit.args = { onFinish: () => console.log('finished') };
