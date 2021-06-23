import { DeleteOutlined } from '@ant-design/icons';
import { Button, Select } from 'antd';
import { useState } from 'react';
const { Option } = Select;

type Props = {
  header: string;
  placeholder?: string;
  onSelect: (jointTeachingObj) => void;
  onDelete: () => void;
  selectedValue: string | undefined | null;
};

const SelectWithDeleteOption = ({
  header,
  placeholder,
  onSelect,
  onDelete,
  selectedValue,
}: Props) => {
  return (
    <>
      <span>{header}</span>
      <br />
      <Select
        value={selectedValue || undefined}
        size='small'
        showSearch
        style={{ width: 200 }}
        placeholder={placeholder}
        onChange={onSelect}
      >
        <Option value='Test1'>Testing1</Option>
        <Option value='Test2'>Testing2</Option>
        <Option value='Test3'>Testing3</Option>
      </Select>
      <Button
        icon={<DeleteOutlined style={{ border: 'none' }} />}
        style={{ border: 'none' }}
        size='small'
        danger
        onClick={onDelete}
      ></Button>
    </>
  );
};

export default SelectWithDeleteOption;
