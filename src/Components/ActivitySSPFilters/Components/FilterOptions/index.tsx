import { ReactNode } from 'react';
import { Form, Select } from 'antd';

interface Props {
  options?: Record<string, string>[];
  label: string | ReactNode;
  name: string;
}
const FilterOptions = (props: Props) => {
  const { options, label, name } = props;
  return (
    <>
      <span>{label}</span>
      <Form.Item name={name}>
        <Select
          mode='multiple'
          open
          getPopupContainer={(node) => node.parentNode}
          className='filter-modal__select-box'
        >
          {options?.map((opt) => (
            <Select.Option value={opt.value} key={opt.value}>
              {opt.label}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </>
  );
};

export default FilterOptions;
