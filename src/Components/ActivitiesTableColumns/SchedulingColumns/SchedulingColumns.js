import ActivityStatusCol from './StatusCol/ActivityStatusCol';
import SortableTableCell from '../../DynamicTable/SortableTableCell';
import SchedulingActions from './SchedulingActions/SchedulingActions';
import ActivityTag from './ActivityTaging';

export const SchedulingColumns = (selectedRowKeys = []) => [
  {
    title: '',
    key: 'activityScheduling',
    dataIndex: undefined,
    width: 90,
    render: (activity) => {
      return (
        <SortableTableCell className={`activityScheduling_${activity._id}`}>
          <SchedulingActions
            activity={activity}
            selectedRowKeys={selectedRowKeys}
          />
        </SortableTableCell>
      );
    },
  },
  {
    title: 'Tag',
    key: 'activityTag',
    dataIndex: undefined,
    width: 100,
    render: (activity) => (
      <SortableTableCell className={`activityTag${activity._id}`}>
        <ActivityTag activities={[activity]} />
      </SortableTableCell>
    ),
    sorter: true,
  },
  {
    title: 'Status',
    key: 'activityStatus',
    dataIndex: null,
    width: 110,
    render: (activity) => (
      <SortableTableCell className={`activityStatus_${activity._id}`}>
        <ActivityStatusCol activity={activity} />
      </SortableTableCell>
    ),
    sorter: true,
  },
];
