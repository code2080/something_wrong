// COMPONENTS
import ColumnWrapper from './new/ColumnWrapper';
import TitleCell from './new/TitleCell';
import ActivityStatusCol from '../../Components/ActivitiesTableColumns/SchedulingColumns/StatusCol/ActivityStatusCol';
import SortableTableCell from '../../Components/DynamicTable/SortableTableCell';
import ActivityTag from '../../Components/ActivitiesTableColumns/SchedulingColumns/ActivityTaging';

// COLUMNS
import { Field } from 'Redux/TE/te.selectors';
import { TActivity } from 'Types/Activity.type';
import type { ColumnsType } from 'antd/lib/table';
import { TimingColumns } from './ActivityValueColumns/ValueTypes/TimingColumns';

// SORTERS
export const createActivitiesTableColumnsFromMapping = (design) => {
  const allActivityValues = [
    ...Object.keys(design.objects).map(
      (objKey) => ['types', objKey] as [Field, string],
    ),
    ...Object.keys(design.fields).map(
      (fieldKey) => ['fields', fieldKey] as [Field, string],
    ),
  ];
  const activityValueColumns = allActivityValues.reduce<ColumnsType<object>>(
    (values, [field, extId]) => [
      ...values,
      {
        title: <TitleCell extId={extId} field={field} />,
        key: extId,
        displayName: 'ActivityCol',
        render: (activity: TActivity) => (
          <ColumnWrapper
            activity={activity}
            type='VALUE'
            prop={extId}
            mapping={design}
          />
        ),
      },
    ],
    [],
  );

  return [
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
      dataIndex: undefined,
      width: 110,
      render: (activity) => (
        <SortableTableCell className={`activityStatus_${activity._id}`}>
          <ActivityStatusCol activity={activity} />
        </SortableTableCell>
      ),
      sorter: true,
    },
    ...TimingColumns[design.timing.mode](design),
    ...activityValueColumns,
  ];
};
