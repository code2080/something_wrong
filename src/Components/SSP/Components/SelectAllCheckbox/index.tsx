import { Checkbox } from 'antd';
import useSSP from 'Components/SSP/Utils/hooks';

const SelectAllCheckbox = () => {
  const { selectedKeys, setSelectedKeys, selectAllKeys, results } = useSSP();

  return (
    <Checkbox
      checked={selectedKeys.length > 0}
      indeterminate={
        selectedKeys.length > 0 && selectedKeys.length < results.length
      }
      onChange={(e) => {
        if (!e.target.checked) {
          setSelectedKeys([]);
        } else {
          selectAllKeys();
        }
      }}
    />
  );
};

export default SelectAllCheckbox;
