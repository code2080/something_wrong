// COMPONENTS
import SSPTable from 'Components/SSP/Components/Table';
import { ObjectAllocationColumn } from 'Components/TableColumnsShared';

// HOOKS
import useSSP from 'Components/SSP/Utils/hooks';
import { useSelector } from 'react-redux';
import { selectLabelForType } from 'Redux/TE/te.selectors';

// REDUX

// UTILS

// TYPES

const GroupManagementTable = () => {
  const { metadata } = useSSP();
  /**
   * SELECTORS
   */
  const groupTypeLabel = useSelector(
    selectLabelForType(metadata.groupTypeExtId),
  );

  /**
   * COLUMNS
   */

  return (
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
          ? [ObjectAllocationColumn(groupTypeLabel)]
          : []),
      ]}
      rowKey='_id'
    />
  );
};

export default GroupManagementTable;
