// COMPONENTS
import { StarOutlined, StarFilled } from '@ant-design/icons';
import ScopedObject from '../FormToolbar/ScopedObject';
import DateTime from '../Common/DateTime';
import StatusLabel from '../StatusLabel';

// SORTERS

// ACTIONS
import { toggleFormInstanceStarringStatus } from '../../Redux/FormSubmissions/formSubmissions.actions';

// CONSTANTS
import { teCoreSchedulingProgressProps } from '../../Constants/teCoreProps.constants';
import { themeColors } from '../../Constants/themeColors.constants';
import ObjectRequestValue from '../Elements/ObjectRequestValue';
import FormInstanceAssignment from './Components/FormInstanceAssignment';
import AcceptanceStatus from './Components/AcceptanceStatus';
import { sortAlpha, sortBoolean, sortTime } from './Helpers/sorters';
import SubmissionActionButton from './Components/SubmissionActionButton';

export const formSubmission = {
  NAME: {
    title: 'Submitter',
    key: 'recipientId',
    dataIndex: 'firstName',
    render: (recipientId, submission) => submission.submitter,
    sorter: (a, b) => a.submitter.localeCompare(b.submitter),
  },
  SUBMISSION_DATE: {
    title: 'Submitted',
    key: 'submittedAt',
    dataIndex: 'submittedAt',
    render: (val) => <DateTime value={val} />,
    sorter: (a, b) => sortTime(a.submittedAt, b.submittedAt),
  },
  SCOPED_OBJECT: (objectRequests) => {
    return {
      title: 'Primary object',
      key: 'scopedObject',
      dataIndex: 'scopedObjectLabel',
      render: (_, { scopedObject }) => {
        const request = objectRequests.find(
          (request) => request._id === scopedObject,
        );
        return request ? (
          <ObjectRequestValue request={request} />
        ) : (
          <ScopedObject objectExtId={scopedObject} />
        );
      },
      sorter: (a, b) => sortAlpha(a.scopedObject, b.scopedObject),
    };
  },
  ACTION_BUTTON: {
    title: '',
    key: 'actions',
    fixedWidth: 40,
    render: (formInstance) => (
      <SubmissionActionButton formInstance={formInstance} />
    ),
  },
  SCHEDULING_PROGRESS: {
    title: 'Scheduling progress',
    key: 'schedulingProgress',
    dataIndex: 'teCoreProps.schedulingProgress',
    render: (_, { teCoreProps }) =>
      teCoreProps ? (
        <StatusLabel
          color={
            teCoreSchedulingProgressProps[teCoreProps.schedulingProgress].color
          }
          className='no-margin'
        >
          {teCoreSchedulingProgressProps[teCoreProps.schedulingProgress].label}
        </StatusLabel>
      ) : (
        'N/A'
      ),
    sorter: (lSubmission, rSubmission) =>
      sortAlpha(
        lSubmission.teCoreProps.schedulingProgress,
        rSubmission.teCoreProps.schedulingProgress,
      ),
  },
  ACCEPTANCE_STATUS: {
    title: 'Acceptance status',
    key: 'acceptanceStatus',
    dataIndex: 'teCoreProps.acceptanceStatus',
    render: (_, { teCoreProps }) => (
      <AcceptanceStatus
        acceptanceStatus={teCoreProps.acceptanceStatus}
        acceptanceComment={teCoreProps.acceptanceComment}
      />
    ),
    sorter: (a, b) =>
      sortAlpha(a.teCoreProps.acceptanceStatus, b.teCoreProps.acceptanceStatus),
  },
  ASSIGNMENT: {
    title: 'Assignment',
    key: 'assignedTo',
    fixedWidth: 85,
    render: (formInstance) => {
      const {
        teCoreProps: { assignedTo },
      } = formInstance;
      return (
        <FormInstanceAssignment
          assignedTo={assignedTo}
          formId={formInstance.formId}
          formInstanceId={formInstance._id}
        />
      );
    },
  },
  SCHEDULE_LINK: {
    title: 'Schedule link',
    key: 'scheduleLink',
    dataIndex: 'reviewLink',
    fixedWidth: 185,
    render: (reviewLink) =>
      reviewLink ? (
        <a href={reviewLink} rel='noreferrer' target='_blank'>
          Link
        </a>
      ) : (
        'N/A'
      ),
  },
  IS_STARRED: (dispatch, disabled) => ({
    title: 'Is starred',
    key: 'isStarred',
    dataIndex: 'teCoreProps.isStarred',
    sorter: (a, b) =>
      sortBoolean(a.teCoreProps.isStarred, b.teCoreProps.isStarred),
    align: 'center',
    fixedWidth: 100,
    render: (_, item) => {
      const { teCoreProps } = item;
      const { isStarred } = teCoreProps;
      const iconProps = {
        style: { fontSize: '0.9rem', color: themeColors.jungleGreen },
        onClick: (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!disabled) {
            dispatch(
              toggleFormInstanceStarringStatus({
                formInstanceId: item._id,
                isStarred,
              }),
            );
          }
        },
      };
      return isStarred ? (
        <StarFilled {...iconProps} />
      ) : (
        <StarOutlined {...iconProps} />
      );
    },
  }),
};
