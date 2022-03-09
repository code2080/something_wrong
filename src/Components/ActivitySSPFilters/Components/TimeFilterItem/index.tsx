import { TimePicker, Form } from 'antd';

// TYPES
type Props = {
  onChange: (updValue: any) => void;
  value: any;
};

const TimeFilterItem = ({ onChange, value }: Props) => {
  return (
    <Form.Item label='Select time interval'>
      <TimePicker.RangePicker
        format='HH:mm'
        allowEmpty={[true, true]}
        minuteStep={30}
        clearIcon={false}
        onChange={onChange}
        value={value}
        allowClear={false}
      />
    </Form.Item>
  );
};

export default TimeFilterItem;
