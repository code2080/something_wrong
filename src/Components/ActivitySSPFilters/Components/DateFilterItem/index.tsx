import { DatePicker, Form } from "antd"

// TYPES
type Props = {
  onChange: (updValue: any) => void;
};

const DateFilterItem = ({ onChange }: Props) => {
  return (
    <Form.Item label='Select date interval' name='date'>
      <DatePicker.RangePicker allowEmpty={[true, true]} minuteStep={30} onChange={onChange} />
    </Form.Item>
  );
};

export default DateFilterItem;