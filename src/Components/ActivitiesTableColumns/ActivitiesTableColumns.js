import React from 'react';
import { useSelector } from 'react-redux';

// COMPONENTS
import BaseActivityColOuter from './ActivityValueColumns/Base/BaseActivityColOuter';
import SortableTableCell from '../DynamicTable/SortableTableCell';

// COLUMNS
import { StaticColumns } from './StaticColumns/StaticColumns';
import { TimingColumns } from './ActivityValueColumns/ValueTypes/TimingColumns';
import { SchedulingColumns } from './SchedulingColumns/SchedulingColumns';

// SELECTORS
import { selectExtIdLabel } from '../../Redux/TE/te.selectors';

// SORTERS
import { sortByElementDeepHtml } from '../../Utils/sorting.helpers';

export const createActivitiesTableColumnsFromMapping = (design, includeSubmissionInfo = false) => [
  ...SchedulingColumns,
  ...TimingColumns[design.timing.mode](design),
  ...[
    ...Object.keys(design.objects).map(objKey => ['types', objKey]),
    ...Object.keys(design.fields).map(fieldKey => ['fields', fieldKey])
  ].reduce((values, [field, extId]) => [
    ...values,
    {
      title: useSelector(state => selectExtIdLabel(state)(field, extId)),
      key: extId,
      displayName: 'ActivityCol',
      render: activity => (
        <SortableTableCell className={`extId_${extId.replace(/\./g, '-')}_${activity._id}`}>
          <BaseActivityColOuter
            activity={activity}
            type='VALUE'
            prop={extId}
            mapping={design}
          />
        </SortableTableCell>
      ),
      sorter: (a, b) => {
        return sortByElementDeepHtml(
          `.extId_${extId.replace(/\./g, '-')}_${a._id} .base-activity-col--wrapper`,
          `.extId_${extId.replace(/\./g, '-')}_${b._id} .base-activity-col--wrapper`
        );
      },
    }
  ],
  []
  ),
  ...StaticColumns(includeSubmissionInfo)
];
