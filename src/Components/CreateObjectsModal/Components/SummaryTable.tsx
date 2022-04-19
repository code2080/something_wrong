import { Table } from 'antd';

// COMPONENTS
import { ObjectLabel, TypeLabel } from 'Components/Label';

// TYPES
import {
  ECreateObjectsMode,
  TRequestSummary,
} from 'Types/GroupManagement.type';

type Props = {
  mode: ECreateObjectsMode;
  requestSummary: TRequestSummary[];
};

const SummaryTable = ({ requestSummary, mode }: Props) => {
  return (
    <Table
      columns={[
        {
          title: 'Primary object',
          key: 'primaryObject',
          dataIndex: 'primaryObject',
          render: (primaryObjectExtId) => (
            <ObjectLabel extId={primaryObjectExtId} />
          ),
        },
        {
          title: 'Max number of tracks needed',
          key: 'maxTracksForPrimaryObject',
          dataIndex: 'maxTracksForPrimaryObject',
        },
        {
          title: 'Mode',
          key: 'mode',
          dataIndex: undefined,
          render: () =>
            mode === ECreateObjectsMode.SINGLE_GROUP
              ? 'One group'
              : 'Use tracks',
        },
        {
          title: 'Objects to be created',
          key: 'numberOfObjects',
          dataIndex: undefined,
          render: (_, requestSummary) => (
            <>
              {requestSummary.numberOfObjects} of type '
              <TypeLabel extId={requestSummary.typeExtId} />'
            </>
          ),
        },
      ]}
      rowKey='primaryObject'
      dataSource={requestSummary}
      pagination={{ size: 'small', hideOnSinglePage: true }}
    />
  );
};

export default SummaryTable;
