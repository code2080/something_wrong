// COMPONENTS
import ColumnWrapper from './new/ColumnWrapper';
import TitleCell from './new/TitleCell';

// COLUMNS
import { TimingColumns } from './ActivityValueColumns/ValueTypes/TimingColumns';
import { SchedulingColumns } from './SchedulingColumns/SchedulingColumns';
import { StaticColumns } from './StaticColumns/StaticColumns';

// SORTERS
export const createActivitiesTableColumnsFromMapping = (
  design,
  selectedRowKeys = [],
) => {
  const allActivityValues = [
    ...Object.keys(design.objects).map((objKey) => ['types', objKey]),
    ...Object.keys(design.fields).map((fieldKey) => ['fields', fieldKey]),
  ];
  const activityValueColumns = allActivityValues.reduce(
    (values, [field, extId]) => [
      ...values,
      {
        title: <TitleCell extId={extId} field={field} />,
        key: extId,
        displayName: 'ActivityCol',
        render: (activity) => (
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
    ...SchedulingColumns(selectedRowKeys),
    ...TimingColumns[design.timing.mode](design),
    ...activityValueColumns,
    ...StaticColumns,
  ];
};
