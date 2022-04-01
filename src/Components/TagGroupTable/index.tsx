// COMPONENTS
import SSPTable from 'Components/SSP/Components/Table';
import {
  groupByTagActivitiesFailedColumn,
  groupByTagActivitiesScheduledColumn,
  groupByTagActivitiesUnscheduledColumn,
  groupByTagFilterColumn,
  groupByTagNumberOfActivitiesColumn,
  groupByTagTagNameColumn,
  SchedulingStatusGroupedColumn,
} from 'Components/TableColumnsShared';

const TagGroupTable = () => {
  const columns = [
    groupByTagFilterColumn,
    groupByTagTagNameColumn,
    SchedulingStatusGroupedColumn,
    groupByTagNumberOfActivitiesColumn,
    groupByTagActivitiesScheduledColumn,
    groupByTagActivitiesFailedColumn,
    groupByTagActivitiesUnscheduledColumn,
  ];

  return <SSPTable columns={columns} rowKey='_id' />;
};

export default TagGroupTable;
