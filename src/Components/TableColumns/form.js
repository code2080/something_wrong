import React from 'react';

// COMPONENTS
import ResponseTracker from './Components/ResponseTracker';
import StatusLabel from '../StatusLabel/StatusLabel';
import ObjectScopeCol from './Components/ObjectScopeCol';

// CONSTANTS
import { formStatusProps } from '../../Constants/formStatuses.constants';

// HELPERS
import { sortAlpha, sortTime } from './Helpers/sorters';

export const form = {
  NAME: {
    title: 'Name',
    key: 'name',
    dataIndex: 'name',
    sorter: (a, b) => sortAlpha(a.name, b.name, false),
  },
  DESCRIPTION: {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    sorter: (a, b) => sortAlpha(a.description, b.description, false),
  },
  OBJECT_SCOPE: {
    title: 'Scope',
    dataIndex: 'objectScope',
    key: 'objectScope',
    fixedWidth: 100,
    sorter: (a, b) => sortAlpha(a.objectScope, b.objectScope, false),
    render: objectScope => <ObjectScopeCol objectScope={objectScope} />,
  },
  RESPONSE_TRACKER: {
    key: 'responses',
    title: 'Responses',
    dataIndex: 'responses',
    render: responses => <ResponseTracker responses={responses} />,
  },
  OWNER: {
    key: 'owner',
    title: 'Owner',
    dataIndex: 'ownerName',
    sorter: (a, b) => sortAlpha(a.ownerName, b.ownerName, false),
  },
  PERIOD: {
    key: 'Period',
    title: 'period',
    dataIndex: 'formPeriodDisplay',
  },
  DUE_DATE: {
    title: 'Due date',
    dataIndex: 'dueDateDisplay',
    fixedWidth: 90,
    sorter: (a, b) => sortTime(a.dueDate, b.dueDate),
  },
  FORM_STATUS: {
    title: 'Status',
    key: 'status',
    dataIndex: 'status',
    fixedWidth: 100,
    render: status => formStatusProps[status] != null ? (
      <StatusLabel
        color={formStatusProps[status].color}
        className="no-margin"
      >
        {formStatusProps[status].label}
      </StatusLabel>
    ) : null,
    sorter: (a, b) => sortAlpha(a.status, b.status),
  },
};
