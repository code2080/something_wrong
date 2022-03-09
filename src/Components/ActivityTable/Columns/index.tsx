// COMPONENTS
import RowActions from './RowActions';
import Submitter from './Submitter';
import Tag from './Tag';
import SchedulingStatus from './SchedulingStatus';

// TYPES
import { TActivity } from 'Types/Activity.type';

export const RowActionsColumn = {
  title: '',
  key: 'rowActions',
  dataIndex: undefined,
  width: 130,
  render: (activity: TActivity) => <RowActions activity={activity} />,
};

export const SubmitterColumn = {
  title: 'Submission',
  key: 'metadata.submitter',
  width: 170,
  render: (activity: TActivity) =>
    activity.formInstanceId ? (
      <Submitter activity={activity} />
    ) : (
      'Merged activity'
    ),
};

export const TagColumn = {
  title: 'Tag',
  key: 'activityTag',
  dataIndex: undefined,
  width: 100,
  render: (activity: TActivity) => <Tag activity={activity} />,
};

export const SchedulingStatusColumn = {
  title: 'Status',
  key: 'activityStatus',
  dataIndex: undefined,
  width: 110,
  render: (activity: TActivity) => <SchedulingStatus activity={activity} />,
  sorter: true,
};
