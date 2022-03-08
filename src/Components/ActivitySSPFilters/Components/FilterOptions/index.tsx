import { ReactNode } from 'react';
import { Select } from 'antd';

type Props = {
  options?: Record<string, string>[];
  label: string | ReactNode;
  onChange: (val: string) => void;
  value: string[];
};

const FilterOptions = ({ options, label, onChange, value }: Props) => {
  return (
    <>
      <div>{label}</div>
      <Select
        mode='multiple'
        open
        getPopupContainer={(node) => node.parentNode}
        className='filter-modal__select-box'
        onChange={onChange}
        value={value as any}
      >
        {options?.map((opt) => (
          <Select.Option value={opt.value} key={opt.value}>
            {opt.label}
          </Select.Option>
        ))}
      </Select>
    </>
  );
};

export default FilterOptions;
