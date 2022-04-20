// COMPONENTS
import SSPTable from 'Components/SSP/Components/Table';
import { ObjectAllocationColumn } from 'Components/TableColumnsShared';

// HOOKS
import useSSP from 'Components/SSP/Utils/hooks';
import { useSelector } from 'react-redux';
import { selectLabelForType } from 'Redux/TE/te.selectors';

// STYLES
import './index.scss';

const GroupManagementTable = () => {
  const { metadata } = useSSP();
  /**
   * SELECTORS
   */
  const groupTypeLabel = useSelector(
    selectLabelForType(metadata.groupTypeExtId),
  );

  return (
    <div className="group-management-table--wrapper">
      <SSPTable
        columns={[
          {
            title: 'Primary object',
            key: 'primaryObject',
            dataIndex: 'primaryObject',
            render: (primaryObject) => primaryObject, // @TODO add label rendering
          },
          {
            title: 'Activity type',
            key: 'activityType',
            dataIndex: 'activityType',
            render: (activityType) => activityType, // @TODO add label rendering
          },
          {
            title: 'Tracks',
            key: 'totalTracksForActivityType',
            dataIndex: 'totalTracksForActivityType',
          },
          ...(metadata.groupTypeExtId
            ? [ObjectAllocationColumn(groupTypeLabel, metadata.groupTypeExtId)]
            : []),
        ]}
        rowKey='_id'
      />
    </div>
  );
};

export default GroupManagementTable;
