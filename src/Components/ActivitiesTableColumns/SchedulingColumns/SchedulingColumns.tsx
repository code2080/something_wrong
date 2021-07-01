import SortableTableCell from '../../DynamicTable/SortableTableCell';
import SchedulingActions from './SchedulingActions/SchedulingActions';

export const SchedulingColumns = [
  {
    title: '',
    key: 'activityScheduling',
    dataIndex: undefined,
    width: 90,
    render: (activity) => (
      <SortableTableCell className={`activityScheduling_${activity._id}`}>
        <SchedulingActions activity={activity} />
      </SortableTableCell>
    ),
  },
];
