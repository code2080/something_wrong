import React from 'react';

// COMPONENTS
import EllipsisRenderer from './Components/EllipsisRenderer';
import ResponseTracker from './Components/ResponseTracker';
import StatusLabel from '../StatusLabel/StatusLabel';

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
    // render: name => <EllipsisRenderer text={name} />,
  },
  DESCRIPTION: {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    sorter: (a, b) => sortAlpha(a.description, b.description, false),
    // render: description => <EllipsisRenderer text={description} width={250} />,
  },
  OBJECT_SCOPE: {
    title: 'Scope',
    dataIndex: 'objectScope',
    key: 'objectScope',
    sorter: (a, b) => sortAlpha(a.objectScope, b.objectScope, false),
    render: scope => scope || 'N/A',
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
    sorter: (a, b) => sortTime(a.dueDate, b.dueDate),
  },
  FORM_STATUS: {
    title: 'Status',
    key: 'status',
    dataIndex: 'status',
    render: status => formStatusProps[status] != null ? (
      <StatusLabel color={formStatusProps[status].color}>
        {formStatusProps[status].label}
      </StatusLabel>
    ) : null,
    sorter: (a, b) => sortAlpha(a.status, b.status),
  },
};
