// COMPONENTS
import RowActions from './RowActions';
import Submitter from './Submitter';
import Tag from './Tag';
import SchedulingStatus from './SchedulingStatus';

// TYPES
import { TActivity } from 'Types/Activity/Activity.type';
import { EActivitySortingKey } from 'Types/Activity/ActivitySortingKey.enum';
import { ISSPColumn } from 'Components/SSP/Types';

export const RowActionsColumn: ISSPColumn = {
  title: '',
  key: 'rowActions',
  dataIndex: undefined,
  width: 130,
  render: (activity: TActivity) => <RowActions activity={activity} />,
};

export const SubmitterColumn: ISSPColumn = {
  title: 'Submission',
  key: EActivitySortingKey.SUBMITTER,
  width: 170,
  render: (activity: TActivity) =>
    activity.formInstanceId ? (
      <Submitter activity={activity} />
    ) : (
      'Merged activity'
    ),
  sorter: true,
};

export const TagColumn: ISSPColumn = {
  title: 'Tag',
  key: EActivitySortingKey.TAG,
  dataIndex: undefined,
  width: 100,
  render: (activity: TActivity) => <Tag activity={activity} />,
  sorter: true,
};

export const SchedulingStatusColumn: ISSPColumn = {
  title: 'Status',
  key: EActivitySortingKey.ACTIVITY_STATUS,
  dataIndex: undefined,
  width: 110,
  render: (activity: TActivity) => <SchedulingStatus activity={activity} />,
  sorter: true,
};

export const jointTeachingObjectColumn: ISSPColumn = {
  title: 'Joint teaching object',
  key: EActivitySortingKey.JOINT_TEACHING_OBJECT,
  // dataIndex: EActivitySortingKey.JOINT_TEACHING_OBJECT,
  dataIndex: undefined,
  width: 100,
  render: (activity: TActivity) => activity.jointTeaching?.object ?? '',
};

export const primaryObjectColumn: ISSPColumn = {
  title: 'Primary object',
  key: EActivitySortingKey.PRIMARY_OBJECT,
  // dataIndex: EActivitySortingKey.PRIMARY_OBJECT,
  dataIndex: undefined,
  width: 100,
  render: (activity: TActivity) => activity.metadata?.primaryObject ?? '',
  sorter: true,
};

//todo: what is this..
export const primaryObjectsColumn: ISSPColumn = {
  title: 'Primary objects',
  key: EActivitySortingKey.PRIMARY_OBJECT + 'S',
  // dataIndex: EActivitySortingKey.PRIMARY_OBJECT,
  dataIndex: undefined,
  width: 100,
  render: (activity: TActivity) => 'todo: what to put here??',
  sorter: true,
};
