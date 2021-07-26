import { ItemsMapping } from './FilterModal.type';

import { Form, DatePicker, TimePicker } from 'antd';

export const REPLACED_KEY = '____';
export const NESTED_FIELDS = ['objects', 'fields'];

export const FILTER_ITEMS_MAPPING: ItemsMapping = {
  date: {
    name: 'date',
    title: 'Date',
    label: 'Date',
    render: () => (
      <Form.Item label="Select date interval" name='date'>
        <DatePicker.RangePicker allowEmpty={[true, true]} />
      </Form.Item>
    ),
  },
  time: {
    name: 'time',
    title: 'Time',
    label: 'Time',
    render: () => (
      <Form.Item label="Select time interval" name="time">
        <TimePicker.RangePicker format='HH:mm' allowEmpty={[true, true]} />
      </Form.Item>
    ),
  },
  // startTime: {
  //   name: 'startTime',
  //   title: 'Start time',
  //   label: 'Start time',
  //   render: () => (
  //     <Form.Item label="Select start time" name="startTime">
  //       <TETimePicker format="HH:mm" />
  //     </Form.Item>
  //   ),
  // },
  // endTime: {
  //   name: 'endTime',
  //   title: 'End time',
  //   label: 'End time',
  //   render: () => (
  //     <Form.Item label="Select end time" name="endTime">
  //       <TETimePicker format="HH:mm" />
  //     </Form.Item>
  //   ),
  // },
  // submitter: generateSelectComponent({
  //   title: 'Submitter',
  //   name: 'submitter',
  //   label: 'Select submitters',
  // }),
  // tag: generateSelectComponent({
  //   title: 'Tag',
  //   name: 'tag',
  //   label: 'Select tags',
  // }),
  // primaryObject: generateSelectComponent({
  //   title: 'Primary object',
  //   name: 'primaryObject',
  //   label: 'Priamry object',
  // })
};
