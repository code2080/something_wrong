import React from 'react';

import { Form, Select } from 'antd';
import { SelectOption } from './FilterModal.type';
import FilterItemLabel from './FilterItemLabel';

interface Props {
  options?: SelectOption[];
  label: string;
  name: string;
}
const FilterOptions = (props: Props) => {
  const { options, label, name } = props;

  return (
    <>
      <FilterItemLabel label={label} />
      <Form.Item name={name}>
        <Select mode="multiple" open getPopupContainer={node => node.parentNode} className="filter-modal__select-box">
          {options?.map(opt => (
            <Select.Option value={opt.value} key={opt.value}>
              {opt.label}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </>
  )

};

export default FilterOptions;
