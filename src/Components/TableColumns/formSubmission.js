import React from 'react';

// COMPONENTS
import SubmissionActionButton from './Components/SubmissionActionButton';
import StatusLabel from '../StatusLabel/StatusLabel';
import AcceptanceStatus from './Components/AcceptanceStatus';
import FormInstanceAssignment from './Components/FormInstanceAssignment';
import ScopedObject from '../FormToolbar/ScopedObject';
import DateTime from '../Common/DateTime';

// SORTERS
import { sortAlpha, sortBoolean, sortTime } from './Helpers/sorters';

// CONSTANTS
import { teCoreSchedulingProgressProps } from '../../Constants/teCoreProps.constants';

export const formSubmission = {
  NAME: {
    title: 'Submitter',
    key: 'submitter',
    dataIndex: 'submitter',
    sorter: (a, b) => a.submitter.localeCompare(b.submitter)
  },
  SUBMISSION_DATE: {
    title: 'Submitted',
    key: 'submittedAt',
    dataIndex: 'submittedAt',
    render: val => <DateTime value={val} />,
    sorter: (a, b) => sortTime(a.submittedAt, b.submittedAt)
  },
  SCOPED_OBJECT: {
    title: 'Primary object',
    key: 'scopedObject',
    dataIndex: 'scopedObject',
    render: val => <ScopedObject objectExtId={val} />,
    sorter: (a, b) => sortAlpha(a.scopedObject, b.scopedObject)
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
    render: val => val
      ? (
        <StatusLabel
          color={teCoreSchedulingProgressProps[val].color}
          className='no-margin'
        >
          {teCoreSchedulingProgressProps[val].label}
        </StatusLabel>
      )
      : 'N/A',
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
  },
  SCHEDULE_LINK: {
    title: 'Schedule link',
    key: 'scheduleLink',
    dataIndex: 'reviewLink',
    fixedWidth: 185,
    render: reviewLink => reviewLink ? <a href={reviewLink} rel='noreferrer' target='_blank'>Link</a> : 'N/A',
  },
  IS_STARRED: {
    title: 'Is starred',
    key: 'isStarred',
    dataIndex: 'teCoreProps.isStarred',
    sorter: (a, b) => sortBoolean(a.teCoreProps.isStarred, b.teCoreProps.isStarred),
    align: 'center',
    fixedWidth: 100,
  }
};
