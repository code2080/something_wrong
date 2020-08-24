import React from 'react';
import moment from 'moment';

// COMPONENTS
import SubmissionActionButton from './Components/SubmissionActionButton';
import StatusLabel from '../StatusLabel/StatusLabel';
import AcceptanceStatus from './Components/AcceptanceStatus';
import FormInstanceAssignment from './Components/FormInstanceAssignment';
import ScopedObject from '../FormToolbar/ScopedObject';

// SORTERS
import { sortAlpha } from './Helpers/sorters';

// CONSTANTS
import { teCoreSchedulingProgressProps } from '../../Constants/teCoreProps.constants';

export const formSubmission = {
  NAME: {
    title: 'Submitter',
    key: 'submitter',
    dataIndex: 'submitter',
    sorter: (a, b) => a.localeCompare(b)
  },
  SUBMISSION_DATE: {
    title: 'Submitted',
    key: 'updatedAt',
    dataIndex: 'updatedAt',
    render: val => moment(val).format('YYYY-MM-DD'),
    sorter: (a, b) =>
      moment(a.updatedAt).valueOf() - moment(b.updatedAt).valueOf()
  },
  SCOPED_OBJECT: {
    title: 'Scoped object',
    key: 'scopedObject',
    dataIndex: 'scopedObject',
    render: val => <ScopedObject objectExtId={val} />,
    sorter: (a, b) => a.scopedObject - b.scopedObject
  },
  ACTION_BUTTON: {
    title: '',
    key: 'actions',
    dataIndex: null,
    fixedWidth: 40,
    render: (_, formInstance) => (
      <SubmissionActionButton formInstance={formInstance} />
    )
  },
  SCHEDULING_PROGRESS: {
    title: 'Scheduling progress',
    key: 'schedulingProgress',
    dataIndex: 'teCoreProps.schedulingProgress',
    render: val => val ? (
      <StatusLabel
        color={teCoreSchedulingProgressProps[val].color}
        className="no-margin"
      >
        {teCoreSchedulingProgressProps[val].label}
      </StatusLabel>
    ) : 'N/A',
    sorter: (a, b) => sortAlpha(a.teCoreProps.schedulingProgress, b.teCoreProps.schedulingProgress),
  },
  ACCEPTANCE_STATUS: {
    title: 'Acceptance status',
    key: 'acceptanceStatus',
    dataIndex: 'teCoreProps',
    render: teCoreProps => <AcceptanceStatus acceptanceStatus={teCoreProps.acceptanceStatus} acceptanceComment={teCoreProps.acceptanceComment} />,
    sorter: (a, b) => sortAlpha(a.teCoreProps.acceptanceStatus, b.teCoreProps.acceptanceStatus),
  },
  ASSIGNMENT: {
    title: 'Assigned to',
    key: 'assignedTo',
    dataIndex: 'teCoreProps.assignedTo',
    fixedWidth: 85,
    render: (assignedTo, formInstance) =>
      <FormInstanceAssignment assignedTo={assignedTo} formId={formInstance.formId} formInstanceId={formInstance._id} />,
  }
};
