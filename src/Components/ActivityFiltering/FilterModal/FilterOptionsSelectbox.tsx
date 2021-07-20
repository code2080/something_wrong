import React, { useState, useMemo } from 'react';

import { Form, Select, Input, Typography } from 'antd';
import { SelectOption } from './FilterModal.type';

interface Props {
  options?: SelectOption[];
  label: string;
  name: string;
}
const FilterOptions = (props: Props) => {
  const [query, setQuery] = useState('');
  const { options, label, name } = props;

  const filteredOptions = useMemo(
    () => options?.filter(({ label, value }) =>
      label.toLowerCase().includes(query.toLowerCase()) || value.toLowerCase().includes(query.toLowerCase())), [options, query]);

  return (
    <>
      <Typography.Text>{label}</Typography.Text>
      <Input placeholder="Search..." value={query} onChange={e => setQuery(e.target.value)} size="small" />
      <Form.Item name={name}>
        <Select mode="multiple" open getPopupContainer={node => node.parentNode} className="filter-modal__select-box">
          {filteredOptions?.map(opt => (
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
