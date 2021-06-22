import { DeleteOutlined } from '@ant-design/icons';
import { Button, Select } from 'antd';

type Props = {
  header: string;
  placeholder: string;
};

const SelectWithDeleteOption = ({ header, placeholder }: Props) => {
  const handleDelete = () => {};
  return (
    <>
      <span>{header}</span>
      <br />
      <Select
        size='small'
        showSearch
        style={{ width: 200 }}
        placeholder={placeholder}
      ></Select>
      <Button
        icon={<DeleteOutlined style={{ border: 'none' }} />}
        style={{ border: 'none' }}
        size='small'
        danger
        onClick={handleDelete}
      ></Button>
    </>
  );
};

export default SelectWithDeleteOption;
