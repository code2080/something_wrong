import { DeleteOutlined } from '@ant-design/icons';
import { Button, Select } from 'antd';
import { useSelector } from 'react-redux';
import { selectMultipleExtIdLabels } from 'Redux/TE/te.selectors';

type Props = {
  header: string;
  placeholder?: string;
  onSelect: (jointTeaching) => void;
  onDelete: () => void;
  selectedValue: string | undefined | null;
  selectValues: (string | null)[];
};

const SelectWithDeleteOption = ({
  header,
  placeholder,
  onSelect,
  onDelete,
  selectedValue,
  selectValues,
}: Props) => {
  const labels = useSelector(selectMultipleExtIdLabels)(
    selectValues.map((val: any) => ({
      field: 'objects',
      extId: val,
    })),
  );

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
        {(selectValues as any)?.map((val: string) => (
          <Select.Option key={val} value={val as string}>
            {labels[val]}
          </Select.Option>
        ))}
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
