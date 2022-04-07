import { useParams } from 'react-router-dom';

// COMPONENTS
import SSPTable from 'Components/SSP/Components/Table';

// REDUX

// UTILS

// TYPES

const GroupManagementTable = () => {
  const { formId } = useParams<{ formId: string }>();

  /**
   * SELECTORS
   */

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
      ]}
      rowKey='_id'
    />
  );
};

export default GroupManagementTable;
