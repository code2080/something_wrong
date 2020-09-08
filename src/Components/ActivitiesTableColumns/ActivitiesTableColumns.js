import React from 'react';
import { useSelector } from 'react-redux';

// COMPONENTS
import BaseActivityColOuter from './BaseColumn/BaseActivityColOuter';

// CONSTANTS
import { StaticColumns } from './StaticColumns/StaticColumns';
import { TimingColumns } from './TimingColumns/TimingColumns';
import { selectExtIdLabel } from '../../Redux/TE/te.selectors';

export const createActivitiesTableColumnsFromMapping = mapping => [
  ...TimingColumns[mapping.timing.mode](mapping),
  ...[
    ...Object.keys(mapping.objects).map(objKey => ['types', objKey]),
    ...Object.keys(mapping.fields).map(fieldKey => ['fields', fieldKey])
  ].reduce((values, [field, extId]) => [
    ...values,
    {
      title: useSelector(state => selectExtIdLabel(state)(field, extId)),
      key: extId,
      dataIndex: null,
      render: (_, activity) => (
        <BaseActivityColOuter
          activity={activity}
          type="VALUE"
          prop={extId}
          mapping={mapping}
        />
      )
    }
  ],
  []
  ),
  ...StaticColumns
];
