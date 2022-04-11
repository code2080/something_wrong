// COMPONENTS
import RowActions from './RowActions';
import Submitter from './Submitter';
import Tag from './Tag';
import SchedulingStatusSingle from './SchedulingStatusSingle';
import SchedulingStatusGrouped from './SchedulingStatusGrouped';
import WeekPatternActivityType from './WeekPatternActivityType';
import WeekPatternWeeks from './WeekPatternWeeks';
import ActivityProgress from './ActivityProgress';
import ActivityTrack from './ActivityTrack';
import SspColumnFilter from './SspColumnFilter';
import JobStatus from './JobStatus';
import GroupedTags from './GroupedTags';

// TYPES
import { TActivity } from 'Types/Activity/Activity.type';
import { EActivitySortingKey } from 'Types/Activity/ActivitySortingKey.enum';
import { ISSPColumn } from 'Components/SSP/Types';
import { EActivityStatus } from 'Types/Activity/ActivityStatus.enum';
import { TWeekPatternGroup } from 'Types/Activity/WeekPatternGroup.type';
import { TJob } from 'Types/Job.type';
import { TTagGroup } from 'Types/Activity/TagGroup.type';
import JobTags from './JobTags';
import { TActivityTypeTrackGroup } from 'Types/GroupManagement.type';
import ObjectAllocation from './ObjectAllocation';

export const RowActionsColumn: ISSPColumn = {
  title: '',
  key: 'rowActions',
  dataIndex: undefined,
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
  render: (activity: TActivity) => (
    <SchedulingStatusSingle activity={activity} />
  ),
  sorter: true,
};

export const SchedulingStatusGroupedColumn: ISSPColumn = {
  title: 'Status',
  key: EActivitySortingKey.ACTIVITY_STATUS,
  dataIndex: 'activityStatuses',
  width: 110,
  render: (activityStatuses: EActivityStatus[]) => (
    <SchedulingStatusGrouped activityStatuses={activityStatuses} />
  ),
  sorter: true,
};

export const WeekPatternActivityTypeColumn: ISSPColumn = {
  title: 'Activity type',
  key: 'activityType',
  dataIndex: undefined,
  render: (wpg) => <WeekPatternActivityType wpgId={wpg._id} />,
};

export const WeekPatternWeeksColumn: ISSPColumn = {
  title: 'Weeks',
  key: 'minMaxWeeks',
  dataIndex: undefined,
  render: (wpg) => <WeekPatternWeeks wpgId={wpg._id} />,
};

export const GroupedTagsColumn: ISSPColumn = {
  title: 'Tags',
  key: 'tags',
  dataIndex: undefined,
  render: (wpg: TWeekPatternGroup) => (
    <GroupedTags tagIds={wpg.tagIds} activityIds={wpg.activityIds} />
  ),
};

export const jointTeachingObjectColumn: ISSPColumn = {
  title: 'Joint teaching object',
  key: EActivitySortingKey.JOINT_TEACHING_OBJECT, // @DT these are not sortable?
  // dataIndex: EActivitySortingKey.JOINT_TEACHING_OBJECT,
  dataIndex: undefined,
  render: (activity: TActivity) => activity.jointTeaching?.object ?? '',
};

export const PrimaryObjectColumn: ISSPColumn = {
  title: 'Primary object',
  key: EActivitySortingKey.PRIMARY_OBJECT,
  dataIndex: undefined,
  render: (activity: TActivity) => activity.metadata?.primaryObject || 'N/A',
  sorter: true,
};

export const WeekPatternPrimaryObjectColumn: ISSPColumn = {
  title: 'Primary object',
  key: 'wpgPrimaryObject',
  dataIndex: undefined,
  render: (wpg: TWeekPatternGroup) => wpg.primaryObject || 'N/A',
  sorter: true,
};

export const WeekPatternFilterColumn: ISSPColumn = {
  title: '',
  key: 'weekPatternUIDFilter',
  dataIndex: '_id',
  render: (wpgId: string) => (
    <SspColumnFilter filters={{ weekPatternUID: [wpgId] }} />
  ),
  sorter: true,
};

export const WeekPatternUIDColumn: ISSPColumn = {
  title: 'Week pattern',
  key: 'weekPatternUID',
  dataIndex: undefined,
  render: (activity: TActivity) => activity.metadata?.weekPatternUID || 'N/A',
  sorter: true,
};

export const WeekPatternIdColumn: ISSPColumn = {
  title: 'UID',
  key: 'weekPatternUid',
  dataIndex: '_id',
  render: (weekPatternUID: string) => weekPatternUID || 'N/A',
  sorter: true,
};

export const JobStatusColumn: ISSPColumn = {
  title: 'Status',
  key: 'status',
  dataIndex: undefined,
  render: (job: TJob) => <JobStatus job={job} />,
};

export const JobTagColumn: ISSPColumn = {
  title: 'Tags',
  key: 'tagNames',
  dataIndex: 'tagNames',
  render: (tagNames: string[]) => <JobTags tagNames={tagNames} />,
};

export const primaryObjectsColumn: ISSPColumn = {
  title: 'Primary objects',
  key: EActivitySortingKey.PRIMARY_OBJECT + 'S', // @DT these are not sortable?
  // dataIndex: EActivitySortingKey.PRIMARY_OBJECT,
  dataIndex: undefined,
  render: (_activity: TActivity) => 'todo: what to put here??',
  sorter: true,
};

export const groupByTagFilterColumn: ISSPColumn = {
  title: '',
  key: 'groupByTagIDFilter',
  dataIndex: '_id',
  render: (id: string) => <SspColumnFilter filters={{ tag: [id] }} />,
  width: 32,
};

export const groupByTagTagNameColumn: ISSPColumn = {
  title: 'Name',
  key: 'tagName',
  dataIndex: 'tagName',
  sorter: true,
};

export const groupByTagNumberOfActivitiesColumn: ISSPColumn = {
  title: '# activities',
  key: 'noOfActivities',
  dataIndex: 'noOfActivities',
  width: 100,
  sorter: true,
};

export const groupByTagActivitiesScheduledColumn: ISSPColumn = {
  title: '# scheduled',
  key: 'noOfActivitiesScheduled',
  render: (tagGroup: TTagGroup) => (
    <ActivityProgress
      totalActivities={tagGroup?.noOfActivities || 0}
      progressedActivities={tagGroup?.noOfActivitiesScheduled || 0}
      progressColor={'green'}
    />
  ),
  width: 180,
  sorter: true,
};

export const groupByTagActivitiesFailedColumn: ISSPColumn = {
  title: '# failed',
  key: 'noOfActivitiesFailed',
  render: (tagGroup: TTagGroup) => (
    <ActivityProgress
      totalActivities={tagGroup.noOfActivities}
      progressedActivities={tagGroup.noOfActivitiesFailed}
      progressColor={'red'}
    />
  ),
  width: 180,
  sorter: true,
};

export const groupByTagActivitiesUnscheduledColumn: ISSPColumn = {
  title: '# not scheduled',
  key: 'noOfActivitiesUnscheduled',
  render: (tagGroup: TTagGroup) => (
    <ActivityProgress
      totalActivities={tagGroup.noOfActivities}
      progressedActivities={tagGroup.noOfActivitiesUnscheduled}
      progressColor={'gray'}
    />
  ),
  width: 180,
  sorter: true,
};

export const TrackColumn: ISSPColumn = {
  title: 'Track',
  key: 'track',
  width: 30,
  render: (activity: TActivity) => (
    <ActivityTrack trackNumber={Number(activity.rowIdx?.split('-')[2]) + 1} />
  ),
  sorter: false,
};

export const ObjectAllocationColumn = (typeLabel: string): ISSPColumn => ({
  title: typeLabel,
  key: 'groupType',
  dataIndex: undefined,
  render: (activityTypeGroup: TActivityTypeTrackGroup) => (
    <ObjectAllocation
      activityIdsPerTrack={activityTypeGroup.activityIds}
      connectedObjects={activityTypeGroup.connectedObjects}
      typeExtId={'courseevt'}
    />
  ),
})
