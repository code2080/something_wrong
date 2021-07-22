import { ItemsMapping } from './FilterModal.type';

import { Form, DatePicker, Row, Col } from 'antd';
import TETimePicker from 'Components/Common/TETimePicker/TETimePicker';

export const REPLACED_KEY = '____';
export const NESTED_FIELDS = ['objects', 'fields'];

export const FILTER_ITEMS_MAPPING: ItemsMapping = {
  date: {
    name: 'date',
    title: 'Date',
    label: 'Start date',
    render: () => (
      <Row gutter={8}>
        <Col span={24}>
          <p>Select date interval</p>
        </Col>
        <Col span={12}>
          <Form.Item label='Start' name='startDate'>
            <DatePicker />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label='End' name='endDate'>
            <DatePicker />
          </Form.Item>
        </Col>
      </Row>
    ),
  },
  time: {
    name: 'time',
    title: 'Time',
    label: 'Time',
    render: () => (
      <Row gutter={8}>
        <Col span={24}>
          <p>Select time interval</p>
        </Col>
        <Col span={12}>
          <Form.Item label='Start' name='startTime'>
            <TETimePicker format='HH:mm' minuteStep={15} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label='End' name='endTime'>
            <TETimePicker format='HH:mm' minuteStep={15} />
          </Form.Item>
        </Col>
      </Row>
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
