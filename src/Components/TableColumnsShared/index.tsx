// COMPONENTS
import RowActions from './RowActions';
import Submitter from './Submitter';
import Tag from './Tag';
import SchedulingStatusSingle from './SchedulingStatusSingle';
import SchedulingStatusGrouped from './SchedulingStatusGrouped';
import WeekPatternActivityType from './WeekPatternActivityType';
import WeekPatternWeeks from './WeekPatternWeeks';

// TYPES
import { TActivity } from 'Types/Activity/Activity.type';
import { EActivitySortingKey } from 'Types/Activity/ActivitySortingKey.enum';
import { ISSPColumn } from 'Components/SSP/Types';
import { EActivityStatus } from 'Types/Activity/ActivityStatus.enum';
import GroupedTags from './GroupedTags';
import { TWeekPatternGroup } from 'Types/Activity/WeekPatternGroup.type';


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

export const SchedulingStatusSingleColumn: ISSPColumn = {
  title: 'Status',
  key: EActivitySortingKey.ACTIVITY_STATUS,
  dataIndex: undefined,
  width: 110,
  render: (activity: TActivity) => <SchedulingStatusSingle activity={activity} />,
  sorter: true,
};

export const SchedulingStatusGroupedColumn: ISSPColumn = {
  title: 'Status',
  key: EActivitySortingKey.ACTIVITY_STATUS,
  dataIndex: 'activityStatuses',
  width: 110,
  render: (activityStatuses: EActivityStatus[]) => <SchedulingStatusGrouped activityStatuses={activityStatuses} />,
  sorter: true,
};

export const WeekPatternActivityTypeColumn: ISSPColumn = {
  title: 'Activity type',
  key: 'activityType',
  dataIndex: undefined,
  render: (wpg) => <WeekPatternActivityType wpgId={wpg._id} />
};

export const WeekPatternWeeksColumn: ISSPColumn = {
  title: 'Weeks',
  key: 'minMaxWeeks',
  dataIndex: undefined,
  render: (wpg) => <WeekPatternWeeks wpgId={wpg._id} />
}

export const GroupedTagsColumn: ISSPColumn = {
  title: 'Tags',
  key: 'tags',
  dataIndex: undefined,
  render: (wpg: TWeekPatternGroup) => <GroupedTags tagIds={wpg.tagIds} activityIds={wpg.activityIds} />,
};

export const jointTeachingObjectColumn: ISSPColumn = {
  title: 'Joint teaching object',
  key: EActivitySortingKey.JOINT_TEACHING_OBJECT, // @DT these are not sortable?
  // dataIndex: EActivitySortingKey.JOINT_TEACHING_OBJECT,
  dataIndex: undefined,
  width: 100,
  render: (activity: TActivity) => activity.jointTeaching?.object ?? '',
};

export const primaryObjectColumn: ISSPColumn = {
  title: 'Primary object',
  key: EActivitySortingKey.PRIMARY_OBJECT, // @DT these are not sortable?
  // dataIndex: EActivitySortingKey.PRIMARY_OBJECT,
  dataIndex: undefined,
  width: 100,
  render: (activity: TActivity) => activity.metadata?.primaryObject ?? '',
  sorter: true,
};

export const primaryObjectsColumn: ISSPColumn = {
  title: 'Primary objects',
  key: EActivitySortingKey.PRIMARY_OBJECT + 'S', // @DT these are not sortable?
  // dataIndex: EActivitySortingKey.PRIMARY_OBJECT,
  dataIndex: undefined,
  width: 100,
  render: (_activity: TActivity) => 'todo: what to put here??',
  sorter: true,
};
