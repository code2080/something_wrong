import { ItemsMapping, SelectOption } from './FilterModal.type';

import { Form, DatePicker, TimePicker, Select, Row, Col } from 'antd';

export const generateSelectComponent = ({ title, name, label, parent }: {
  title: string,
  name: string,
  label: string,
  parent?: string,
}) => ({
  name,
  title,
  label,
  parent,
  render: (options?: SelectOption[]) => (
    <Form.Item label={label} name={name}>
      <Select allowClear mode="multiple">
        {options?.map(opt => (
          <Select.Option value={opt.value} key={opt.value}>
            {opt.label}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  ),
});

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
          <Form.Item label="Start" name="startDate">
            <DatePicker />
          </Form.Item>
        </Col>
        <Col span={12}>
        <Form.Item label="End" name="endDate">
          <DatePicker />
        </Form.Item>
        </Col>
      </Row>
    ),
  },
  startTime: {
    name: 'startTime',
    title: 'Start time',
    label: 'Start time',
    render: () => (
      <Form.Item label="Select time interval" name="startTime">
        <TimePicker format="HH:mm" />
      </Form.Item>
    ),
  },
  endTime: {
    name: 'endTime',
    title: 'End time',
    label: 'End time',
    render: () => (
      <Form.Item label="Select time interval" name="endTime">
        <TimePicker format="HH:mm" />
      </Form.Item>
    ),
  },
  submitter: generateSelectComponent({
    title: 'Submitter',
    name: 'submitter',
    label: 'Select submitters',
  }),
  tag: generateSelectComponent({
    title: 'Tag',
    name: 'tag',
    label: 'Select tags',
  }),
  primaryObject: generateSelectComponent({
    title: 'Primary object',
    name: 'primaryObject',
    label: 'Priamry object',
  })
};

