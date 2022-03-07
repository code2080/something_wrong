import { DatePicker, Form, TimePicker } from "antd";
import { EActivityStatus } from "Types/ActivityStatus.enum";
import { toActivityStatusDisplay } from "../helpers";
import { TFilterItemsMapping } from "../types";
import FilterOptions from "./FilterOptions";

export const FILTER_ITEMS_MAPPING: TFilterItemsMapping = {
  date: {
    name: 'date',
    title: 'Date',
    label: 'Date',
    render: () => (
      <Form.Item label='Select date interval' name='date'>
        <DatePicker.RangePicker allowEmpty={[true, true]} minuteStep={30} />
      </Form.Item>
    ),
  },
  time: {
    name: 'time',
    title: 'Time',
    label: 'Time',
    render: () => (
      <Form.Item label='Select time interval' name='time'>
        <TimePicker.RangePicker
          format='HH:mm'
          allowEmpty={[true, true]}
          minuteStep={30}
          clearIcon={false}
        />
      </Form.Item>
    ),
  },
  status: {
    name: 'status',
    title: 'Status',
    label: 'Status',
    render: () => (
      <FilterOptions
        options={Object.keys(EActivityStatus).map((key) => ({
          label: toActivityStatusDisplay(key),
          value: key,
        }))}
        label='Status'
        name='status'
      />
    ),
  },
};