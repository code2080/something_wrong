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
import WorkerInProgress from '../WorkerInProgress';

// TYPES
type Props = {
  rowKey?: string;
  columns: ISSPColumn[];
  allowRowSelection?: boolean;
};

const SSPTable = ({ rowKey = '_id', columns, allowRowSelection = true }: Props) => {
  const { loading, results, workerStatus } = useSSP();
  const pagination = usePagination();
  const rowSelection = useRowSelection(allowRowSelection);
  const sorting = useSorting();

  if (workerStatus === 'IN_PROGRESS') return <WorkerInProgress />;

  return (
    <Table
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
