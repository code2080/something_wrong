import { TimePicker, Form } from 'antd';

// TYPES
type Props = {
  onChange: (updValue: any) => void;
};

const TimeFilterItem = ({ onChange }: Props) => {
  return (
    <Form.Item label='Select time interval' name='time'>
      <TimePicker.RangePicker
        format='HH:mm'
        allowEmpty={[true, true]}
        minuteStep={30}
        clearIcon={false}
        onChange={onChange}
      />
    </Form.Item>
  );
};

export default TimeFilterItem;
