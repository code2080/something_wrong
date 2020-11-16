import React from 'react';
import moment from 'moment';

// COMPONENTS
import ResponseTracker from './Components/ResponseTracker';
import StatusLabel from '../StatusLabel/StatusLabel';
import ObjectScopeCol from './Components/ObjectScopeCol';
import IconFormType from '../FormType/IconFormType';

// CONSTANTS
import { formStatusProps } from '../../Constants/formStatuses.constants';

// HELPERS
import { sortAlpha, sortTime } from './Helpers/sorters';
import Form from '../../Models/Form.model';
import DateTime from '../Common/DateTime';

export const form = {
  CREATEDAT: {
    title: 'Created at',
    key: 'createdAt',
    dataIndex: 'createdAt',
    fixedWidth: 100,
    sorter: (a, b) => sortTime(b.createdAt, a.createdAt),
    render: createdDate => <DateTime value={createdDate} />
  },
  TYPE: {
    title: '',
    key: 'formType',
    dataIndex: 'formType',
    fixedWidth: 35,
    render: type => <IconFormType type={type} />
  },
  NAME: {
    title: 'Name',
    key: 'name',
    dataIndex: 'name',
    sorter: (a, b) => sortAlpha(a.name, b.name, false)
  },
  DESCRIPTION: {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    sorter: (a, b) => sortAlpha(a.description, b.description, false)
  },
  OBJECT_SCOPE: {
    title: 'Scope',
    dataIndex: 'objectScope',
    key: 'objectScope',
    fixedWidth: 100,
    sorter: (a, b) => sortAlpha(a.objectScope, b.objectScope, false),
    render: objectScope => <ObjectScopeCol objectScope={objectScope} />
  },
  RESPONSE_TRACKER: {
    key: 'responses',
    title: 'Responses',
    dataIndex: 'responses',
    render: responses => <ResponseTracker responses={responses} />
  },
  OWNER: {
    key: 'owner',
    title: 'Owner',
    dataIndex: 'ownerId',
    sorter: (a, b) =>
      sortAlpha(Form.getOwnerName(a.ownerId), Form.getOwnerName(b.ownerId)),
    render: ownerId => Form.getOwnerName(ownerId) || 'N/A'
  },
  PERIOD: {
    key: 'Period',
    title: 'period',
    dataIndex: 'formPeriodDisplay'
  },
  DUE_DATE: {
    title: 'Due date',
    dataIndex: 'dueDate',
    key: 'dueDate',
    fixedWidth: 90,
    render: dueDate => <DateTime value={dueDate} />,
    sorter: (a, b) => sortTime(b.dueDate, a.dueDate)
  },
  FORM_STATUS: {
    title: 'Status',
    key: 'status',
    dataIndex: 'status',
    fixedWidth: 100,
    render: status =>
      formStatusProps[status] != null ? (
        <StatusLabel
          color={formStatusProps[status].color}
          className="no-margin"
        >
          {formStatusProps[status].label}
        </StatusLabel>
      ) : null,
    sorter: (a, b) => sortAlpha(a.status, b.status)
  }
};
