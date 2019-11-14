import React from 'react';
import moment from 'moment';
import { teCoreAcceptanceStatus, teCoreSchedulingProgress } from './teCoreProps.constants';

// COMPONENTS
import SubmissionActionButton from '../Components/DynamicTable/SubmissionActionButton';

const toAcceptanceLabel = status => {
  if (status === teCoreAcceptanceStatus.ACCEPTED) {
    return "Accepted";
  }
  if (status === teCoreAcceptanceStatus.REJECTED) {
    return "Rejected";
  }
  return "Not set";
}

const toProgressLabel = progress => {
  if (progress === teCoreSchedulingProgress.NOT_SCHEDULED) {
    return "Not scheduled";
  }
  if (progress === teCoreSchedulingProgress.IN_PROGRESS) {
    return "In progress";
  }
  if (progress === teCoreSchedulingProgress.SCHEDULING_FINISHED) {
    return "Finished";
  }
  return "Not set";
}

export const staticCols = {
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
  }
};
