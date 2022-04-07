import { Table } from "antd"
import { TRequestSummary } from "Types/GroupManagement.type"

// TYPES
type Props = {
  mode: 'HELKLASS' | 'DELKLASS',
  requestSummary: TRequestSummary[]
}

const SummaryTable = ({ requestSummary, mode }: Props) => {
  return (
    <Table
      columns={[
        {
          title: 'Primary object',
          key: 'primaryObject',
          dataIndex: 'primaryObject',
        },
        {
          title: 'Max number of tracks needed',
          key: 'maxTracksForPrimaryObject',
          dataIndex: 'metadata.maxTracksForPrimaryObject',
        },
        {
          title: 'Mode',
          key: 'mode',
          dataIndex: undefined,
          render: () => mode,
        },
        {
          title: 'Objects to be created',
          key: 'numberOfObjects',
          dataIndex: 'numberOfObjects',
        },
      ]}
      dataSource={requestSummary}
    />
  );
};

export default SummaryTable;