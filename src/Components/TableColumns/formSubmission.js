import React from 'react';
import moment from 'moment';
import { toProgressLabel, toAcceptanceLabel } from '../../Constants/teCoreProps.constants';

// COMPONENTS
import SubmissionActionButton from './Components/SubmissionActionButton';

export const formSubmission = {
  NAME: {
    title: 'Submitter',
    key: 'submitter',
    dataIndex: 'submitter',
    sorter: (a, b) => a.localeCompare(b)
  },
  SUBMISSION_DATE: {
    title: 'Date',
    key: 'updatedAt',
    dataIndex: 'updatedAt',
    render: val => moment(val).format('YYYY-MM-DD'),
    sorter: (a, b) => moment(a.updatedAt).valueOf() - moment(b.updatedAt).valueOf(),
  },
  SCOPED_OBJECT: {
    title: 'Scoped object',
    key: 'scopedObject',
    dataIndex: 'scopedObject',
    render: val => val || 'Not scoped',
    sorter: (a, b) => a.scopedObject - b.scopedObject,
  },
  ACTION_BUTTON: {
    title: 'Actions',
    key: 'actions',
    dataIndex: null,
    render: (_, formInstance) => <SubmissionActionButton formInstance={formInstance} />,
  },
  SCHEDULING_PROGRESS: {
    title: 'Scheduling progress',
    key: 'schedulingProgress',
    dataIndex: 'teCoreProps.schedulingProgress',
    render: val => toProgressLabel(val),
    sorter: (a, b) => a.localeCompare(b),
  },
  ACCEPTANCE_STATUS: {
    title: 'Acceptance status',
    key: 'acceptanceStatus',
    dataIndex: 'teCoreProps.acceptanceStatus',
    render: val => toAcceptanceLabel(val),
    sorter: (a, b) => a.localeCompare(b),
  },
  ACCEPTANCE_COMMENT: {
    title: 'Acceptance comment',
    key: 'acceptanceComment',
    dataIndex: 'teCoreProps.acceptanceComment',
    render: val => val || '',
    sorter: (a, b) => a.localeCompare(b),
  }
};
