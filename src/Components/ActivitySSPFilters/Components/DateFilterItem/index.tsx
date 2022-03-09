import { DatePicker, Form } from 'antd';

// TYPES
type Props = {
  onChange: (updValue: any) => void;
  value: any;
};

const DateFilterItem = ({ onChange, value }: Props) => {
  return (
    <Form.Item label='Select date interval'>
      <DatePicker.RangePicker
        allowEmpty={[true, true]}
        minuteStep={30}
        onChange={onChange}
        value={value}
        allowClear={false}
      />
    </Form.Item>
  );
};

export default DateFilterItem;
