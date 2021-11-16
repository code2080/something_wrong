// COMPONENTS
import { Field } from 'Redux/TE/te.selectors';
import { TActivity } from 'Types/Activity.type';
import type { ColumnsType } from 'antd/lib/table';
import ActivityStatusCol from '../../Components/ActivitiesTableColumns/SchedulingColumns/StatusCol/ActivityStatusCol';
import SortableTableCell from '../../Components/DynamicTable/SortableTableCell';
import ActivityTag from '../../Components/ActivitiesTableColumns/SchedulingColumns/ActivityTaging';

// COLUMNS
import { ActivityDesign } from '../../Models/ActivityDesign.model';
import TitleCell from './new/TitleCell';
import ColumnWrapper from './new/ColumnWrapper';
import { TimingColumns } from './ActivityValueColumns/ValueTypes/TimingColumns';
import { ConflictType } from 'Models/JointTeachingGroup.model';

export const createActivitiesTableColumnsFromMapping = (
  design,
  columnPrefix,
  renderer,
) => {
  const _design = new ActivityDesign(design);
  const allActivityValues = [
    ...Object.keys(_design.objects).map(
      (objKey) => ['types', objKey] as [Field, string],
    ),
    ...Object.keys(_design.fields).map(
      (fieldKey) => ['fields', fieldKey] as [Field, string],
    ),
  ];

  const activityValueColumns = allActivityValues.reduce<ColumnsType<object>>(
    (values, [field, extId], valueIndex) => [
      ...values,
      {
        title: <TitleCell extId={extId} field={field} />,
        key: extId,
        render: (activity: TActivity, activityIndex) => (
          <ColumnWrapper
            activity={activity}
            type='VALUE'
            prop={extId}
            mapping={_design}
            columnPrefix={
              typeof columnPrefix === 'function'
                ? (activityValues) => {
                    return columnPrefix(
                      ConflictType.VALUES,
                      [activity, activityIndex],
                      [activityValues, valueIndex],
                    );
                  }
                : undefined
            }
            renderer={
              typeof renderer === 'function'
                ? (activty) => {
                    return renderer(ConflictType.VALUES, activty, extId);
                  }
                : undefined
            }
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
      render: (activity: TActivity) => (
        <SortableTableCell className={`activityTag${activity._id}`}>
          <ActivityTag activity={activity} />
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
    ...TimingColumns[_design.timing.mode](_design, columnPrefix, renderer),
    ...activityValueColumns,
  ];
};
