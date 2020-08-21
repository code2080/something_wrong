import React from 'react';
import { useSelector } from 'react-redux';

// COMPONENTS
import BaseActivityCol from './BaseColumn/BaseActivityCol';

// CONSTANTS
import { StaticColumns } from './StaticColumns/StaticColumns';
import { TimingColumns } from './TimingColumns/TimingColumns';
import { selectExtIdLabel } from '../../Redux/TE/te.selectors';

export const createActivitiesTableColumnsFromMapping = mapping => [
  ...TimingColumns[mapping.timing.mode](mapping),
  ...(Object.keys(mapping.objects) || []).reduce(
    (objects, objectKey) => [
      ...objects,
      {
        title: useSelector(state => selectExtIdLabel(state)('types', objectKey)),
        key: objectKey,
        dataIndex: null,
        render: (_, activity) => (
          <BaseActivityCol
            activity={activity}
            type="VALUE"
            prop={objectKey}
            mapping={mapping}
          />
        )
      }
    ],
    []
  ),
  ...(Object.keys(mapping.fields) || []).reduce(
    (fields, fieldKey) => [
      ...fields,
      {
        title: useSelector(state => selectExtIdLabel(state)('fields', fieldKey)),
        key: fieldKey,
        dataIndex: null,
        render: (_, activity) => (
          <BaseActivityCol
            activity={activity}
            type="VALUE"
            prop={fieldKey}
            mapping={mapping}
          />
        )
      }
    ],
    []
  ),
  ...StaticColumns
];
