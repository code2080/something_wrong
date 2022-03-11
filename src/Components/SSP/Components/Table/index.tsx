/* eslint-disable react/prop-types */
// SSP
import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { ISSPColumn } from 'Components/SSP/Types';
import useSSP, {
  usePagination,
  useRowSelection,
  useSorting,
} from 'Components/SSP/Utils/hooks';

// TYPES
type Props = {
  rowKey?: string;
  columns: ISSPColumn[];
};

const SSPTable = ({ rowKey = '_id', columns }: Props) => {
  const { loading, results } = useSSP();
  const pagination = usePagination();
  const rowSelection = useRowSelection();
  const sorting = useSorting();


  return (
    <Table
      // columns={[
      //   ..._cols,
      //   columnModifierColumn(() => setShowColumnSelection(true)),
      // ]}
      columns={columns as ColumnsType<any>}
      dataSource={results}
      rowKey={rowKey}
      // expandedRowRender={expandedRowRender || null}
      pagination={pagination}
      loading={loading}
      sortDirections={['descend', 'ascend']}
      rowSelection={rowSelection}
      // rowClassName={rowClassName}
      onChange={sorting}
    />
  );
};

export default SSPTable;
