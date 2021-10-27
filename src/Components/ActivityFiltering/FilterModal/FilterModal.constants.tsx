import { Form, DatePicker, TimePicker } from 'antd';
import { EActivityStatus } from 'Types/ActivityStatus.enum';
import { toActivityStatusDisplay } from './FilterModal.helper';
import { ItemsMapping } from './FilterModal.type';
import FilterOptions from './FilterOptionsSelectbox';
import omit from 'lodash/omit';

export const REPLACED_KEY = '____';
export const NESTED_FIELDS = ['objects', 'fields'];

export const INITIAL_FILTER_VALUES = {
  'settings.matchCriteria': 'SOME',
  'settings.includeSubmission': 'SINGLE',
  'settings.jointTeaching': 'INCLUDE',
  status: Object.keys(omit(EActivityStatus, 'INACTIVE')),
} as const;

export const FILTER_ITEMS_MAPPING = (
  isBeta: boolean = false,
): ItemsMapping => ({
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
  ...(isBeta
    ? {
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
              />
            </Form.Item>
          ),
        },
      }
    : {}),
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
});
