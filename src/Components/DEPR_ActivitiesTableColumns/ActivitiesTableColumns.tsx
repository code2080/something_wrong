// COMPONENTS
import { Field, deprSelectIndexedExtIdLabel } from 'Redux/TE/te.selectors';
import { TActivity } from 'Types/Activity.type';
import type { ColumnsType } from 'antd/lib/table';
import ActivityStatusCol from './SchedulingColumns/StatusCol/ActivityStatusCol';
import SortableTableCell from '../DynamicTable/SortableTableCell';
import ActivityTag from './SchedulingColumns/ActivityTaging';
import ActivityTracks from './SchedulingColumns/ActivityTracks';

// COLUMNS
import { ActivityDesign } from '../../Models/ActivityDesign.model';
import ColumnWrapper from './new/ColumnWrapper';
import { TimingColumns } from './ActivityValueColumns/ValueTypes/TimingColumns';
import { ConflictType } from 'Models/JointTeachingGroup.model';
import { useSelector } from 'react-redux';
import _, { uniq } from 'lodash';

export const CreateActivitiesTableColumnsFromMapping = (
  { design, columnPrefix, renderer }: { design: any, columnPrefix?: any, renderer?: any },
  isBeta: boolean = false,
) => {
  const _design = new ActivityDesign(design || {});
  const allActivityValues = [
    ...Object.keys(_design.objects).map(
      (objKey) => ['types', objKey] as [Field, string],
    ),
    ...Object.keys(_design.fields).map(
      (fieldKey) => ['fields', fieldKey] as [Field, string],
    ),
  ];

  const titleMapping = useSelector(deprSelectIndexedExtIdLabel)(
    allActivityValues,
  ) as string;

  const activityValueColumns = allActivityValues.reduce<ColumnsType<object>>(
    (values, [field, extId], valueIndex) => [
      ...values,
      {
        title: titleMapping[`${field}_${extId}`],
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

  return _.compact([
    isBeta && {
      title: 'Tracks',
      key: 'activityTracks',
      dataIndex: undefined,
      width: 100,
      render: (activity: TActivity) => (
        <SortableTableCell className={`activityTracks${activity._id}`}>
          <ActivityTracks activity={activity} />
        </SortableTableCell>
      ),
      sorter: true,
    },
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
  ]);
};

export const CreateActivitiesAllocatedTableColumns = ({
  activities,
  design,
}) => {
  const _design = new ActivityDesign(design);
  const _activities = activities.map((act) => ({
    ...act,
    values: act.values.filter((val) => val.isAllocated),
  }));

  const allocatedFields = uniq(
    _activities.flatMap((act) =>
      act.values
        .filter((actVal) => actVal.isAllocated)
        .map((actVal) => actVal.extId),
    ),
  );

  const titleMapping = useSelector(deprSelectIndexedExtIdLabel)(
    allocatedFields.map((field) => ['types', field as string]),
  ) as string;

  return allocatedFields.map((field) => ({
    title: titleMapping[`types_${field}`],
    key: field,
    render: (activity: TActivity) => (
      <ColumnWrapper
        activity={activity}
        type='VALUE'
        prop={field as string}
        mapping={_design}
        readonly
      />
    ),
  }));
};
