import { Checkbox } from 'antd';
import { ColumnType, Key, TableRowSelection } from 'antd/lib/table/interface';

type Props = {
  rowKey: Key | undefined;
  rowSelection?: TableRowSelection<object>;
  dataSource: readonly object[] | undefined;
};

const SelectionColumn = ({
  rowKey,
  rowSelection,
  dataSource,
}: Props): ColumnType<object> | undefined => {
  const handleChecked = (
    checked: boolean,
    key: Key,
    { onChange, selectedRowKeys }: TableRowSelection<object>,
  ) => {
    const removeKey = (key: Key, selectedRowKeys: Key[] = []) =>
      selectedRowKeys?.filter((id) => id !== key);

    const addKey = (key: Key, selectedRowKeys: Key[] = []) => [
      ...selectedRowKeys,
      key,
    ];

    const getSelectedRows = (rows: typeof dataSource, selectedRowKeys: Key[]) =>
      rows?.filter((data) =>
        selectedRowKeys.includes(data[(rowKey as string | undefined) || '']),
      ) ?? [];

    const newSelectedRowKeys = checked
      ? addKey(key, selectedRowKeys)
      : removeKey(key, selectedRowKeys);

    onChange?.(
      newSelectedRowKeys,
      getSelectedRows(dataSource, newSelectedRowKeys),
    );
  };

  return (
    rowSelection && {
      width: 25,
      title: '',
      dataIndex: rowKey,
      render: (key: Key) => (
        <Checkbox
          checked={rowSelection.selectedRowKeys?.includes(key)}
          onChange={({ target: { checked } }) =>
            handleChecked(checked, key, rowSelection)
          }
        />
      ),
    }
  );
};

export default SelectionColumn;
