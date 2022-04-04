import { DatePicker, Form } from 'antd';
import moment from 'moment';

// TYPES
type Props = {
  onChange: (updValue: any) => void;
  value: any;
};

const DateFilterItem = ({ onChange, value }: Props) => {
  let transform = value;

  // transform string to moment object if the value is already configured
  if (value) {
    transform = [
      value[0] ? moment(value[0]) : null,
      value[1] ? moment(value[1]) : null,
    ];
  }

  return (
    <Form.Item label='Select date interval'>
      <DatePicker.RangePicker
        allowEmpty={[true, true]}
        minuteStep={30}
        onChange={onChange}
        value={transform}
        allowClear={false}
      />
    </Form.Item>
  );
};

export default DateFilterItem;
