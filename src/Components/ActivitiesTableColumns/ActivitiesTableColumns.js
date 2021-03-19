import React from 'react';

// COMPONENTS
import ColumnWrapper from './new/ColumnWrapper';
import TitleCell from './new/TitleCell';

// COLUMNS
import { TimingColumns } from './ActivityValueColumns/ValueTypes/TimingColumns';
import { SchedulingColumns } from './SchedulingColumns/SchedulingColumns';

// SORTERS

export const createActivitiesTableColumnsFromMapping = (design) => {
  console.log(design);
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
    ...SchedulingColumns,
    ...TimingColumns[design.timing.mode](design),
    ...activityValueColumns,
  ];
};

/*
sorter: (a, b) => {
        return sortByElementDeepHtml(
          `.extId_${extId.replace(/\./g, '-')}_${a._id} .base-activity-col--wrapper`,
          `.extId_${extId.replace(/\./g, '-')}_${b._id} .base-activity-col--wrapper`
        );
      },

        <SortableTableCell className={`extId_${extId.replace(/\./g, '-')}_${activity._id}`}>
*/
